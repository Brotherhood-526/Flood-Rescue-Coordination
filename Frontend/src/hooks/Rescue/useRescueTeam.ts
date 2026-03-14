import { useState, useEffect } from "react";
import {
  rescueTeamService,
  type RescueRequest,
} from "@/services/Rescue/rescueTeamService";

const PAGE_SIZE = 10;

export const useRescueTeam = (
  filter: string | null,
  sortOrder: "asc" | "desc",
) => {
  const [data, setData] = useState<RescueRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(0);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await rescueTeamService.getRequests(0, filter || "");
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách cứu hộ:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setPageNumber(0);
  }, [filter, sortOrder]);

  const parseDate = (dateStr: string) => {
    if (!dateStr) return 0;
    const timestamp = Date.parse(dateStr);
    if (!isNaN(timestamp)) return timestamp;

    try {
      const [datePart, timePart] = dateStr.split(" ");
      const [day, month, year] = datePart.split("/");
      return new Date(`${year}-${month}-${day}T${timePart}:00`).getTime();
    } catch {
      return 0;
    }
  };

  const processedData = data
    .filter((item) => {
      if (!filter) return true;
      if (filter === "Tạm hoãn") return item.status === "Tạm hoãn cứu hộ";
      if (filter === "Hoàn thành") return item.status === "Đã hoàn thành";
      return item.status === filter;
    })
    .sort((a, b) => {
      const timeA = parseDate(a.createdAt);
      const timeB = parseDate(b.createdAt);
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

  const totalPage = Math.max(1, Math.ceil(processedData.length / PAGE_SIZE));
  const pagedData = processedData.slice(
    pageNumber * PAGE_SIZE,
    (pageNumber + 1) * PAGE_SIZE,
  );

  const handlePageChange = (prev: boolean) => {
    setPageNumber((p) => {
      if (prev) return Math.max(0, p - 1);
      return Math.min(totalPage - 1, p + 1);
    });
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
