import { useEffect, useState, useCallback } from "react";
import apiClient from "@/services/axiosClient";
import { PAGE_SIZE } from "@/constants/coordinatorConfig";
import type { CoordinatorRequest, TakePageResponse } from "@/types/coordinator";

export const useRequestList = (status: string) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [requestList, setRequestList] = useState<CoordinatorRequest[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Reset page khi đổi status
  useEffect(() => {
    setPageNumber(0);
  }, [status]);

  const fetchRequestList = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await apiClient.post("/coordinator/takeListRequest", {
        pageNumber,
        pageSize: PAGE_SIZE,
        status,
      })) as unknown as TakePageResponse;
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

  const handlePageChange = (left: boolean) => {
    setPageNumber((prev) => {
      if (left) return Math.max(0, prev - 1);
      return Math.min(totalPage - 1, prev + 1);
    });
  };

  return {
    pageNumber,
    pageSize: PAGE_SIZE,
    totalPage,
    requestList,
    loading,
    handlePageChange,
    refetch: fetchRequestList,
  };
};
