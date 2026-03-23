import { type Dispatch, type SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CommonTable } from "@/layouts/DataTable";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  ClipboardPlus,
  RefreshCcw,
  Clock,
  SquareCheck,
  CircleX,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { useRequestList } from "@/hooks/Coordinator/useRequestList";
import { COORDINATOR_STATUS } from "@/constants/coordinatorStatus";
import { ROUTES } from "@/router/routes";
import { formatDateVN } from "@/utils/parseDate";
import type { CoordinatorRequest } from "@/types/coordinator";

export default function ListRequestPage() {
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  return (
    <div className="w-full min-h-[calc(100vh-80px)] p-8 bg-[#fdfdfd] font-sans">
      <Filters filter={filter} setFilter={setFilter} />
      <Requests
        filter={filter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
}

function Filters({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}) {
  const filterButtons = [
    {
      key: COORDINATOR_STATUS.NEW,
      label: "Yêu cầu mới",
      icon: <ClipboardPlus size={44} strokeWidth={1.5} />,
      activeColor: "border-gray-400 ring-2 ring-gray-400 bg-gray-50",
      textColor: "text-gray-600",
    },
    {
      key: COORDINATOR_STATUS.PROCESSING,
      label: "Đang xử lý",
      icon: <RefreshCcw size={44} strokeWidth={1.5} />,
      activeColor: "border-orange-400 ring-2 ring-orange-400 bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      key: COORDINATOR_STATUS.DELAYED,
      label: "Tạm hoãn",
      icon: <Clock size={44} strokeWidth={1.5} />,
      activeColor: "border-purple-400 ring-2 ring-purple-400 bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      key: COORDINATOR_STATUS.COMPLETED,
      label: "Hoàn thành",
      icon: <SquareCheck size={44} strokeWidth={1.5} />,
      activeColor: "border-green-500 ring-2 ring-green-500 bg-green-50",
      textColor: "text-green-600",
    },
    {
      key: COORDINATOR_STATUS.CANCEL,
      label: "Đã hủy",
      icon: <CircleX size={44} strokeWidth={1.5} />,
      activeColor: "border-red-400 ring-2 ring-red-400 bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full mt-20 mb-10">
      <div className="flex gap-8">
        {filterButtons.map(({ key, label, icon, activeColor, textColor }) => (
          <button
            key={key}
            onClick={() => setFilter((prev) => (prev === key ? "" : key))}
            className={`flex flex-col items-center justify-center w-40 h-35 gap-4 transition-all bg-white border-2 rounded-xl ${
              filter === key
                ? activeColor
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <span className={filter === key ? textColor : "text-gray-500"}>
              {icon}
            </span>
            <span
              className={`text-base tracking-wide ${
                filter === key
                  ? `${textColor} font-bold`
                  : "text-gray-600 font-semibold"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Requests({
  filter,
  sortOrder,
  setSortOrder,
}: {
  filter: string;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
}) {
  const {
    pageNumber,
    pageSize,
    totalPage,
    requestList,
    loading,
    handlePageChange,
  } = useRequestList(filter, sortOrder);
  const navigate = useNavigate();

  const handleOpenRequest = (request: CoordinatorRequest) => {
    navigate(ROUTES.COORDINATE_DETAIL.replace(":id", request.id), {
      state: request,
    });
  };

  const columns = ["ID", "Số điện thoại", "Trạng thái", "Thời gian tạo"];

  return (
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

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#25a863] gap-3">
          <Loader2 className="animate-spin" size={36} />
          <p className="text-gray-500 font-medium">
            Đang tải danh sách yêu cầu...
          </p>
        </div>
      ) : (
        <CommonTable
          columns={columns}
          data={requestList}
          renderRow={(r, idx) => (
            <TableRow
              key={pageNumber * pageSize + idx + 1}
              onClick={() => handleOpenRequest(r)}
              className="hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors"
            >
              <TableCell className="font-mono text-gray-500 font-medium">
                #{r.id.substring(0, 8).toUpperCase()}
              </TableCell>
              <TableCell className="font-bold text-gray-800">
                {r.phone}
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell className="text-gray-600 font-medium">
                {formatDateVN(r.createdAt)}
              </TableCell>
            </TableRow>
          )}
        />
      )}

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

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    "yêu cầu mới": {
      label: "Yêu Cầu Mới",
      className: "bg-gray-50 text-gray-600 border-gray-300",
    },
    "đang xử lý": {
      label: "Đang Xử Lý",
      className: "bg-orange-50 text-orange-600 border-orange-300",
    },
    "tạm hoãn": {
      label: "Tạm Hoãn",
      className: "bg-purple-50 text-purple-600 border-purple-300",
    },
    "hoàn thành": {
      label: "Hoàn Thành",
      className: "bg-green-50 text-green-600 border-green-400",
    },
    "đã huỷ": {
      label: "Đã Huỷ",
      className: "bg-red-50 text-red-600 border-red-300",
    },
  };
  console.log("status raw:", JSON.stringify(status));

  const { label, className } = map[status.toLowerCase()] ?? {
    label: status,
    className: "bg-gray-50 text-gray-600 border-gray-300",
  };

  return (
    <span
      className={`px-4 py-1.5 text-[13px] font-bold rounded-md inline-block min-w-32.5 text-center border shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}
