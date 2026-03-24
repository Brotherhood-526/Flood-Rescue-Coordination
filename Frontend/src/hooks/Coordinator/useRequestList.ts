import {
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { coordinatorService } from "@/services/Coordinator/coordinatorService";
import { PAGE_SIZE } from "@/constants/coordinatorConfig";
import { toTimestamp } from "@/utils/parseDate";
import type { CoordinatorRequest } from "@/types/coordinator";

export const useRequestList = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [pageNumber, setPageNumber] = useState(0);
  const [requestList, setRequestList] = useState<CoordinatorRequest[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const handleSetFilter: Dispatch<SetStateAction<string>> = (value) => {
    setStatusFilter(value);
    setPageNumber(0);
  };

  const handleSetSortOrder: Dispatch<SetStateAction<"desc" | "asc">> = (
    value,
  ) => {
    setSortOrder(value);
    setPageNumber(0);
  };

  const fetchRequestList = useCallback(async () => {
    try {
      const data = await coordinatorService.getRequests(
        statusFilter,
        pageNumber,
      );
      setRequestList(data.list);
      setTotalPage(data.totalPage);
    } catch (err) {
      console.error("Fetch request list failed:", err);
    }
  }, [pageNumber, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequestList();
  }, [fetchRequestList]);

  const sortedList = [...requestList].sort((a, b) => {
    const diff = toTimestamp(a.createdAt) - toTimestamp(b.createdAt);
    return sortOrder === "desc" ? -diff : diff;
  });

  const handlePageChange = (left: boolean) => {
    setPageNumber((prev) =>
      left ? Math.max(0, prev - 1) : Math.min(totalPage - 1, prev + 1),
    );
  };

  return {
    pageNumber,
    pageSize: PAGE_SIZE,
    totalPage,
    requestList: sortedList,
    handlePageChange,
    refetch: fetchRequestList,
    filter: statusFilter,
    setFilter: handleSetFilter,
    sortOrder,
    setSortOrder: handleSetSortOrder,
  };
};
