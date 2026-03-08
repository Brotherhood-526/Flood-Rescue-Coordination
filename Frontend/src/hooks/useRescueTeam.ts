import { useState, useEffect } from "react";
import {
  rescueTeamService,
  type RescueRequest,
} from "@/services/rescueTeamService";

export const useRescueTeam = () => {
  const [data, setData] = useState<RescueRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await rescueTeamService.getMyTeamRequests();
      setData(result);
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

  return { data, isLoading, error, refetch: fetchRequests };
};
