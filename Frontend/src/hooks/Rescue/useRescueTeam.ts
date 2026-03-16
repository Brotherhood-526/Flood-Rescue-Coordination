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
      const result = await rescueTeamService.getRequests();
      console.log("Tổng records:", result.length);
      console.log("Các status có trong data:", [
        ...new Set(result.map((r) => r.status)),
      ]);
      setData(Array.isArray(result) ? result : []);
    } catch (_err) {
      console.error("Lỗi khi tải danh sách cứu hộ:", _err);
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

    const timestamp = Date.parse(dateStr.replace(" ", "T"));
    if (!isNaN(timestamp)) return timestamp;

    try {
      const parts = dateStr.trim().split(" ");
      let timePart = "00:00:00";
      let datePart = "01/01/1970";

      if (parts[0].includes(":")) {
        timePart = parts[0];
        datePart = parts[1];
      } else if (parts[1] && parts[1].includes(":")) {
        datePart = parts[0];
        timePart = parts[1];
      } else {
        datePart = parts[0];
      }

      // Nhận diện dấu phân cách - hoặc /
      const separator = datePart.includes("/") ? "/" : "-";
      const dateElements = datePart.split(separator);

      let day, month, year;
      if (dateElements[0].length === 4) {
        [year, month, day] = dateElements;
      } else {
        [day, month, year] = dateElements;
      }

      const formattedIso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}`;
      const finalTime = new Date(formattedIso).getTime();

      return isNaN(finalTime) ? 0 : finalTime;
    } catch {
      return 0;
    }
  };

  const processedData = data
    .filter((item) => {
      const s = (item.status || "").toLowerCase();

      if (!filter) {
        return (
          s.includes("đang xử lý") ||
          s.includes("tạm hoãn") ||
          s.includes("hoàn thành")
        );
      }

      // NẾU CÓ BẤM NÚT LỌC:
      const f = filter.toLowerCase();
      if (f.includes("tạm hoãn")) return s.includes("tạm hoãn");
      if (f.includes("hoàn thành")) return s.includes("hoàn thành");
      if (f.includes("đang xử lý")) return s.includes("đang xử lý");

      return s === f;
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
