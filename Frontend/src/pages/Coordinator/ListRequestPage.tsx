import { Button } from "@/components/ui/button.tsx";
import { CommonTable } from "@/layouts/DataTable.tsx";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import {
  ClipboardPlus,
  RefreshCcw,
  Clock,
  SquareCheck,
  CircleX,
  SlidersVertical,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRequestList } from "@/hooks/Coordinator/useRequestList";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export type RescueRequest = {
  requestID: string;
  phone: string;
  name: string;
  status: "accept" | "reject" | "delayed" | "processing";
  createdAt: string;
};

// const fakeRequests: RescueRequest[] = [
//     {
//         id: 1,
//         phone: "0723456789",
//         rescuer: "Nguyễn Văn A",
//         status: "reject",
//         createdAt: "01/01/2026 00:00",
//     },
//     {
//         id: 2,
//         phone: "0988123123",
//         rescuer: "Trần Văn B",
//         status: "accept",
//         createdAt: "02/01/2026 09:12",
//     },
//     {
//         id: 3,
//         phone: "0912345678",
//         rescuer: "Lê Văn C",
//         status: "delayed",
//         createdAt: "03/01/2026 14:30",
//     },
//     {
//         id: 4,
//         phone: "0901112233",
//         rescuer: "Phạm Văn D",
//         status: "accept",
//         createdAt: "04/01/2026 08:45",
//     },
//     {
//         id: 5,
//         phone: "0377778888",
//         rescuer: "Hoàng Văn E",
//         status: "accept",
//         createdAt: "05/01/2026 11:10",
//     },
//     {
//         id: 6,
//         phone: "0399991111",
//         rescuer: "Đỗ Văn F",
//         status: "processing",
//         createdAt: "06/01/2026 16:22",
//     },
//     {
//         id: 7,
//         phone: "0351234567",
//         rescuer: "Bùi Văn G",
//         status: "processing",
//         createdAt: "07/01/2026 19:05",
//     },
//     {
//         id: 8,
//         phone: "0384567890",
//         rescuer: "Vũ Văn H",
//         status: "processing",
//         createdAt: "08/01/2026 07:50",
//     },
/**
 * Page that displays filter controls and a paginated list of rescue requests.
 *
 * Maintains local filter state and passes it to the Filters and Requests child components.
 *
 * @returns The page's React element containing the filter toolbar and the requests list.
 */

export default function ListRequestPage() {
  const [filter, setFilter] = useState<string>("");

  return (
    <div className="flex flex-col w-full pt-[3vh]">
      <Filters filter={filter} setFilter={setFilter} />
      <Requests filter={filter} />
    </div>
  );
}

export function Filters({
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
    accept:
      "border-[3px] border-emerald-400 text-emerald-600 hover:border-[3px] hover:border-emerald-400 hover:text-emerald-600",
    reject:
      "border-[3px] border-red-400 text-red-600 hover:border-[3px] hover:border-red-400 hover:text-red-600",
    processing:
      "border-[3px] border-yellow-400 text-yellow-700 hover:border-[3px] hover:border-yellow-400 hover:text-yellow-700",
    delayed:
      "border-[3px] border-sky-400 text-sky-600 hover:border-[3px] hover:border-sky-400 hover:text-sky-600",
    completed:
      "border-[3px] border-indigo-400 text-indigo-600 hover:border-[3px] hover:border-indigo-400 hover:text-indigo-600",
  };

  const defaultStyle =
    "border-gray-300 text-gray-700 hover:border-[3px] hover:text-gray-800";

  const getClass = (value: string) =>
    `${baseButton} ${filter === value ? colorMap[value] : defaultStyle}`;

  const handleFilterClick = (value: string) => {
    setFilter((prev) => (prev === value ? "" : value));
  };

  return (
    <div
      className="w-full! bg-white flex-2 pt-[4vh]! pb-[1vh]!
        flex flex-row justify-center items-center gap-10"
    >
      <Button
        className={getClass("accept")}
        onClick={() => handleFilterClick("accept")}
      >
        <ClipboardPlus className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Chấp nhận</span>
      </Button>

      <Button
        className={getClass("processing")}
        onClick={() => handleFilterClick("processing")}
      >
        <RefreshCcw className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Đang xử lý</span>
      </Button>

      <Button
        className={getClass("delayed")}
        onClick={() => handleFilterClick("delayed")}
      >
        <Clock className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Tạm hoãn</span>
      </Button>

      <Button
        className={getClass("completed")}
        onClick={() => handleFilterClick("completed")}
      >
        <SquareCheck className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Hoàn thành</span>
      </Button>

      <Button
        className={getClass("reject")}
        onClick={() => handleFilterClick("reject")}
      >
        <CircleX className="w-10! h-10!" />
        <span className="text-xl! font-semibold">Từ chối</span>
      </Button>
    </div>
  );
}

export function Requests({ filter }: { filter: string }) {
  const { pageNumber, pageSize, totalPage, requestList, handlePageChange } =
    useRequestList(filter);

  useEffect(() => {
    console.log("filter: ", filter);
  }, [filter]);

  const navigate = useNavigate();

  const handleOpenRequest = (request: RescueRequest) => {
    console.log("request sent: ", request);
    navigate(`/coordinate/detail/${request.requestID}`, {
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
    <div
      className="w-full! bg-white flex-8 p-4
        flex flex-col items-center! justify-start"
    >
      <div className="w-full flex justify-end mb-2">
        <SlidersVertical className="w-10! h-10! cursor-pointer" />
      </div>

      <CommonTable
        columns={columns}
        data={requestList}
        renderRow={(r, idx) => (
          <TableRow
            key={pageNumber * pageSize + idx + 1}
            onClick={() => handleOpenRequest(r)}
          >
            <TableCell className="font-semibold">
              0{pageNumber * pageSize + idx + 1}
            </TableCell>
            <TableCell>{r.phone}</TableCell>
            <TableCell>{r.name}</TableCell>
            <TableCell>
              <Status status={r.status} />
            </TableCell>
            <TableCell>{r.createdAt}</TableCell>
          </TableRow>
        )}
      />
      <div className="mt-[1vh]">
        <Button
          className="rounded-full bg-gray-100 hover:bg-gray-300 p-2 mr-[0.5vw]"
          variant="ghost"
          onClick={() => handlePageChange(true)}
        >
          <ChevronsLeft className="w-3 h-3" />
        </Button>
        {pageNumber + 1}/{totalPage}
        <Button
          className="rounded-full bg-gray-100 hover:bg-gray-300 p-2 ml-[0.5vw]"
          variant="ghost"
          onClick={() => handlePageChange(false)}
        >
          <ChevronsRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export function Status({ status }: { status: string }) {
  switch (status) {
    case "accept":
      return (
        <span className="px-4 py-1 rounded-full bg-emerald-200 text-emerald-700">
          Chấp nhận
        </span>
      );
    case "reject":
      return (
        <span className="px-4 py-1 rounded-full bg-red-200 text-red-700">
          Từ chối
        </span>
      );
    case "processing":
      return (
        <span className="px-4 py-1 rounded-full bg-yellow-200 text-yellow-800">
          Đang xử lý
        </span>
      );

    case "delayed":
      return (
        <span className="px-4 py-1 rounded-full bg-sky-200 text-sky-700">
          Tạm Hoãn
        </span>
      );

    case "completed":
      return (
        <span className="px-4 py-1 rounded-full bg-indigo-200 text-indigo-700">
          Hoàn thành
        </span>
      );
  }
}
