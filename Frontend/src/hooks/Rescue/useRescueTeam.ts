import { useState, useEffect, useCallback } from "react";
import { rescueTeamService } from "@/services/Rescue/rescueTeamService";
import { toTimestamp } from "@/utils/parseDate";
import {
  DEFAULT_VISIBLE_STATUSES,
  RESCUE_STATUS,
} from "@/constants/rescueStatus";
import type { RescueRequest } from "@/types/rescue";

const PAGE_SIZE = 10;

export const useRescueTeam = (
  filter: string | null,
  sortOrder: "asc" | "desc",
) => {
  const [data, setData] = useState<RescueRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(0);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await rescueTeamService.getRequests();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách cứu hộ:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    setPageNumber(0);
  }, [filter, sortOrder]);

  const filterByStatus = (status: string): boolean => {
    const s = status.toLowerCase();
    if (!filter) return DEFAULT_VISIBLE_STATUSES.some((v) => s.includes(v));
    const f = filter.toLowerCase();
    return Object.values(RESCUE_STATUS).some(
      (v) => f.includes(v) && s.includes(v),
    );
  };

  const processedData = data
    .filter((item) => filterByStatus(item.status ?? ""))
    .sort((a, b) => {
      const diff = toTimestamp(a.createdAt) - toTimestamp(b.createdAt);
      return sortOrder === "desc" ? -diff : diff;
    });

  const totalPage = Math.max(1, Math.ceil(processedData.length / PAGE_SIZE));
  const pagedData = processedData.slice(
    pageNumber * PAGE_SIZE,
    (pageNumber + 1) * PAGE_SIZE,
  );

  const handlePageChange = (prev: boolean) => {
    setPageNumber((p) =>
      prev ? Math.max(0, p - 1) : Math.min(totalPage - 1, p + 1),
    );
  };

  return {
    pagedData,
    isLoading,
    error,
    refetch: fetchRequests,
    pageNumber,
    totalPage,
    handlePageChange,
  };
};
