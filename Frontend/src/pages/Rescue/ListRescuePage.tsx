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
  // Quản lý state cho UI
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
    const s = (status || "").toLowerCase();

    const base =
      "px-4 py-1.5 text-[13px] font-bold rounded-md inline-block min-w-[130px] text-center border shadow-sm transition-colors";

    if (s.includes("đang xử lý")) {
      return (
        <span
          className={`${base} bg-orange-50 text-orange-600 border-orange-300`}
        >
          Đang xử lý
        </span>
      );
    }
    if (s.includes("tạm hoãn")) {
      return (
        <span
          className={`${base} bg-purple-50 text-purple-600 border-purple-300`}
        >
          Tạm hoãn
        </span>
      );
    }
    if (s.includes("hoàn thành")) {
      return (
        <span className={`${base} bg-green-50 text-green-600 border-green-400`}>
          Hoàn thành
        </span>
      );
    }

    return (
      <span className={`${base} bg-gray-50 text-gray-600 border-gray-300`}>
        {status}
      </span>
    );
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
              activeColor:
                "border-orange-400 ring-2 ring-orange-400 bg-orange-50",
              textColor: "text-orange-600",
            },
            {
              key: "Tạm hoãn",
              icon: <MessageSquareWarning size={44} strokeWidth={1.5} />,
              activeColor:
                "border-purple-400 ring-2 ring-purple-400 bg-purple-50",
              textColor: "text-purple-600",
            },
            {
              key: "Hoàn thành",
              icon: <CheckSquare size={44} strokeWidth={1.5} />,
              activeColor: "border-green-500 ring-2 ring-green-500 bg-green-50",
              textColor: "text-green-600",
            },
          ].map(({ key, icon, activeColor, textColor }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(activeFilter === key ? null : key)}
              className={`flex flex-col items-center justify-center w-40 h-35 gap-4 transition-all bg-white border-2 rounded-xl ${
                activeFilter === key
                  ? activeColor
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <span
                className={activeFilter === key ? textColor : "text-gray-500"}
              >
                {icon}
              </span>
              <span
                className={`text-base tracking-wide ${
                  activeFilter === key
                    ? `${textColor} font-bold`
                    : "text-gray-600 font-semibold"
                }`}
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDownNarrowWide size={18} className="text-gray-600" />
                <span className="font-bold text-gray-700">Mới nhất trước</span>
              </>
            ) : (
              <>
                <ArrowUpNarrowWide size={18} className="text-gray-600" />
                <span className="font-bold text-gray-700">Cũ nhất trước</span>
              </>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#25a863] gap-3">
            <Loader2 className="animate-spin" size={36} />
            <p className="text-gray-500 font-medium">
              Đang tải danh sách yêu cầu...
            </p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-16 text-lg font-semibold">
            {error}
          </p>
        ) : (
          <CommonTable<RescueRequest>
            columns={columns}
            data={pagedData}
            renderRow={(row, idx) => {
              const shortId = row.id
                ? row.id.substring(0, 8).toUpperCase()
                : "N/A";
              const formattedDate = row.createdAt
                ? row.createdAt.includes("T")
                  ? new Date(row.createdAt).toLocaleString("vi-VN")
                  : row.createdAt
                : "N/A";

              return (
                <TableRow
                  key={idx}
                  onClick={() =>
                    navigate(`${ROUTES.RESCUE_DETAIL}?id=${row.id}`)
                  }
                  className="hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors"
                >
                  <TableCell className="font-mono text-gray-500 font-medium">
                    #{shortId}
                  </TableCell>
                  <TableCell className="font-bold text-gray-800">
                    {row.citizenPhone}
                  </TableCell>
                  <TableCell>{renderStatusBadge(row.status)}</TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {formattedDate}
                  </TableCell>
                </TableRow>
              );
            }}
          />
        )}
      </div>

      {/* Paging */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm font-semibold text-gray-600">
        <Button
          variant="outline"
          className="rounded-full w-10 h-10 p-0 hover:bg-gray-200 border-gray-300"
          onClick={() => handlePageChange(true)}
          disabled={pageNumber === 0}
        >
          <ChevronsLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          Trang {pageNumber + 1} / {totalPage || 1}
        </span>
        <Button
          variant="outline"
          className="rounded-full w-10 h-10 p-0 hover:bg-gray-200 border-gray-300"
          onClick={() => handlePageChange(false)}
          disabled={pageNumber + 1 >= totalPage}
        >
          <ChevronsRight className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
