import { useState } from "react";
import {
  RotateCw,
  MessageSquareWarning,
  CheckSquare,
  Loader2,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRescueTeam } from "@/hooks/Rescue/useRescueTeam";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { CommonTable } from "@/layouts/DataTable";
import { TableCell, TableRow } from "@/components/ui/table";
import type { RescueRequest } from "@/services/Rescue/rescueTeamService";

export default function ListRescuePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const navigate = useNavigate();

  const {
    pagedData,
    isLoading,
    error,
    pageNumber,
    totalPage,
    handlePageChange,
  } = useRescueTeam(activeFilter, sortOrder);

  const renderStatusBadge = (status: string) => {
    const base =
      "px-4 py-1.5 text-[13px] font-semibold rounded-full inline-block min-w-[140px]";
    switch (status) {
      case "Đang xử lý":
        return (
          <span className={`${base} bg-[#fff4cc] text-[#d97706]`}>
            {status}
          </span>
        );
      case "Tạm hoãn cứu hộ":
        return (
          <span className={`${base} bg-[#f3e8ff] text-[#9333ea]`}>
            {status}
          </span>
        );
      case "Đã hoàn thành":
        return (
          <span className={`${base} bg-[#dcfce7] text-[#16a34a]`}>
            {status}
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>
        );
    }
  };

  const columns = ["ID", "Số điện thoại", "Trạng thái", "Thời gian tạo"];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] p-8 bg-[#fdfdfd] font-sans">
      {/* Filter buttons */}
      <div className="flex flex-col items-center justify-center w-full -mt-5 mb-10">
        <div className="flex gap-8">
          {[
            {
              key: "Đang xử lý",
              icon: <RotateCw size={44} strokeWidth={1.5} />,
              activeColor: "border-orange-400 ring-2 ring-orange-400",
              textColor: "text-orange-600",
            },
            {
              key: "Tạm hoãn",
              icon: <MessageSquareWarning size={44} strokeWidth={1.5} />,
              activeColor: "border-purple-400 ring-2 ring-purple-400",
              textColor: "text-purple-600",
            },
            {
              key: "Hoàn thành",
              icon: <CheckSquare size={44} strokeWidth={1.5} />,
              activeColor: "border-green-500 ring-2 ring-green-500",
              textColor: "text-green-600",
            },
          ].map(({ key, icon, activeColor, textColor }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(activeFilter === key ? null : key)}
              className={`flex flex-col items-center justify-center w-40 h-35 gap-4 transition-all bg-white border-2 rounded-lg ${activeFilter === key ? activeColor : "border-black hover:shadow-lg"}`}
            >
              <span
                className={activeFilter === key ? textColor : "text-gray-700"}
              >
                {icon}
              </span>
              <span
                className={`text-base tracking-wide ${activeFilter === key ? `${textColor} font-bold` : "text-gray-700 font-medium"}`}
              >
                {key}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort + Table */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-end">
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDownNarrowWide size={18} />
                <span className="font-bold">Mới nhất trước</span>
              </>
            ) : (
              <>
                <ArrowUpNarrowWide size={18} />
                <span className="font-bold">Cũ nhất trước</span>
              </>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500 gap-3">
            <Loader2 className="animate-spin" size={36} />
            <p className="text-gray-500 font-medium">
              Đang tải danh sách yêu cầu...
            </p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-16 text-lg">{error}</p>
        ) : (
          <CommonTable<RescueRequest>
            columns={columns}
            data={pagedData}
            renderRow={(row, idx) => {
              // Cắt ngắn UUID lấy 8 ký tự đầu hiển thị
              const shortId = row.id
                ? row.id.substring(0, 8).toUpperCase()
                : "N/A";

              // Format ngày giờ hiển thị
              const formattedDate = row.createdAt
                ? new Date(row.createdAt).toLocaleString("vi-VN")
                : "N/A";

              return (
                <TableRow
                  key={idx}
                  onClick={() =>
                    navigate(`${ROUTES.RESCUE_DETAIL}?id=${row.id}`)
                  }
                  className="hover:bg-gray-200 cursor-pointer border-b-2"
                >
                  <TableCell className="font-mono text-gray-500">
                    #{shortId}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {row.citizenPhone}
                  </TableCell>
                  <TableCell>{renderStatusBadge(row.status)}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              );
            }}
          />
        )}
      </div>

      {/* Paging */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          variant="ghost"
          className="rounded-full bg-gray-100 hover:bg-gray-300 p-2"
          onClick={() => handlePageChange(true)}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        {pageNumber + 1}/{totalPage}
        <Button
          variant="ghost"
          className="rounded-full bg-gray-100 hover:bg-gray-300 p-2"
          onClick={() => handlePageChange(false)}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
