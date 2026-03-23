import { useEffect, useState, useCallback } from "react";
import apiClient from "@/services/axiosClient";
import { PAGE_SIZE } from "@/constants/coordinatorConfig";
import { toTimestamp } from "@/utils/parseDate";
import type { CoordinatorRequest, TakePageResponse } from "@/types/coordinator";

export const useRequestList = (
  status: string,
  sortOrder: "asc" | "desc" = "desc",
) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [requestList, setRequestList] = useState<CoordinatorRequest[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageNumber(0);
  }, [status, sortOrder]);

  const fetchRequestList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await coordinatorService.getRequests(status, pageNumber);
      setRequestList(data.list);
      setTotalPage(data.totalPage);
    } catch (err) {
      console.error("Fetch request list failed:", err);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, status]);

  useEffect(() => {
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
    loading,
    handlePageChange,
    refetch: fetchRequestList,
  };
};
