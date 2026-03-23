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
  SlidersVertical,
  // ChevronsLeft,
  // ChevronsRight,
} from "lucide-react";
import { useRequestList } from "@/hooks/Coordinator/useRequestList";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export type RescueRequest = {
  requestID: string;
  phone: string;
  name: string;
  status: "accept" | "reject" | "delayed" | "processing";
  createdAt: string;
};

export default function ListRequestPage() {
  const [filter, setFilter] = useState("");
  return (
    <div className="flex flex-col w-full pt-[3vh]">
      <Filters filter={filter} setFilter={setFilter} />
      <Requests filter={filter} />
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
  const baseButton =
    "!rounded-none !bg-white border-2 !w-[10vw] !h-[15vh] " +
    "flex flex-col items-center justify-center gap-2 transition-all";

  const colorMap: Record<string, string> = {
    [COORDINATOR_STATUS.ACCEPT]:
      "border-[3px] border-emerald-400 text-emerald-600",
    [COORDINATOR_STATUS.REJECT]: "border-[3px] border-red-400 text-red-600",
    [COORDINATOR_STATUS.PROCESSING]:
      "border-[3px] border-yellow-400 text-yellow-700",
    [COORDINATOR_STATUS.DELAYED]: "border-[3px] border-sky-400 text-sky-600",
    [COORDINATOR_STATUS.COMPLETED]:
      "border-[3px] border-indigo-400 text-indigo-600",
  };

  const defaultStyle =
    "border-gray-300 text-gray-700 hover:border-[3px] hover:text-gray-800";
  const getClass = (value: string) =>
    `${baseButton} ${filter === value ? colorMap[value] : defaultStyle}`;
  const handleFilterClick = (value: string) =>
    setFilter((prev) => (prev === value ? "" : value));

  return (
    <div className="w-full bg-white flex-2 pt-[4vh] pb-[1vh] flex flex-row justify-center items-center gap-10">
      <Button
        className={getClass(COORDINATOR_STATUS.ACCEPT)}
        onClick={() => handleFilterClick(COORDINATOR_STATUS.ACCEPT)}
      >
        <ClipboardPlus className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Chấp nhận</span>
      </Button>
      <Button
        className={getClass(COORDINATOR_STATUS.PROCESSING)}
        onClick={() => handleFilterClick(COORDINATOR_STATUS.PROCESSING)}
      >
        <RefreshCcw className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Đang xử lý</span>
      </Button>
      <Button
        className={getClass(COORDINATOR_STATUS.DELAYED)}
        onClick={() => handleFilterClick(COORDINATOR_STATUS.DELAYED)}
      >
        <Clock className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Tạm hoãn</span>
      </Button>
      <Button
        className={getClass(COORDINATOR_STATUS.COMPLETED)}
        onClick={() => handleFilterClick(COORDINATOR_STATUS.COMPLETED)}
      >
        <SquareCheck className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Hoàn thành</span>
      </Button>
      <Button
        className={getClass(COORDINATOR_STATUS.REJECT)}
        onClick={() => handleFilterClick(COORDINATOR_STATUS.REJECT)}
      >
        <CircleX className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Từ chối</span>
      </Button>
    </div>
  );
}

export function Requests({ filter }: { filter: string }) {
  const {requestList } =
    useRequestList(filter);
  const navigate = useNavigate();

  const handleOpenRequest = (request: CoordinatorRequest) => {
    navigate(`${ROUTES.COORDINATE_DETAIL.replace(":id", request.requestID)}`, {
      state: request,
    });
  };

  const columns = [
    "ID",
    "Số điện thoại",
    "Người cứu hộ",
    "Trạng thái",
    "Thời gian tạo",
  ];

  return (
    <div className="w-full bg-white flex-8 p-4 flex flex-col items-center justify-start">
      <div className="w-full flex justify-end mb-2">
        <SlidersVertical className="w-10! h-10! cursor-pointer" />
      </div>
      <CommonTable
        columns={columns}
        data={requestList}
        renderRow={(r, idx) => (
          <TableRow
            key={idx}
            onClick={() => handleOpenRequest(r)}
          >
            <TableCell className="font-semibold">
              0{idx + 1}
            </TableCell>
            <TableCell>{r.phone}</TableCell>
            <TableCell>{r.name}</TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>{r.createdAt}</TableCell>
          </TableRow>
        )}
      />
      {/*<div className="mt-[1vh]">*/}
      {/*  <Button*/}
      {/*    className="rounded-full bg-gray-100 hover:bg-gray-300 p-2 mr-[0.5vw]"*/}
      {/*    variant="ghost"*/}
      {/*    onClick={() => handlePageChange(true)}*/}
      {/*  >*/}
      {/*    <ChevronsLeft className="w-3 h-3" />*/}
      {/*  </Button>*/}
      {/*  {pageNumber + 1}/{totalPage}*/}
      {/*  <Button*/}
      {/*    className="rounded-full bg-gray-100 hover:bg-gray-300 p-2 ml-[0.5vw]"*/}
      {/*    variant="ghost"*/}
      {/*    onClick={() => handlePageChange(false)}*/}
      {/*  >*/}
      {/*    <ChevronsRight className="w-3 h-3" />*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
}

export function StatusBadge({ status }: { status: CoordinatorRequestStatus }) {
  const map: Record<
    CoordinatorRequestStatus,
    { label: string; className: string }
  > = {
    accept: {
      label: "Chấp nhận",
      className: "bg-emerald-200 text-emerald-700",
    },
    reject: { label: "Từ chối", className: "bg-red-200 text-red-700" },
    processing: {
      label: "Đang xử lý",
      className: "bg-yellow-200 text-yellow-800",
    },
    delayed: { label: "Tạm Hoãn", className: "bg-sky-200 text-sky-700" },
    completed: {
      label: "Hoàn thành",
      className: "bg-indigo-200 text-indigo-700",
    },
  };
  const { label, className } = map[status] ?? {
    label: status,
    className: "bg-gray-200 text-gray-700",
  };
  return <span className={`px-4 py-1 rounded-full ${className}`}>{label}</span>;
}
