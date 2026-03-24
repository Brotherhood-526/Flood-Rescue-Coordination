import { useCallback, useEffect, useState } from "react";
import { managerService } from "@/services/Manager/managerService";
import type { ManagerDashboard } from "@/types/manager";

export const useManagerDashboard = () => {
  const [dashboard, setDashboard] = useState<ManagerDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await managerService.getDashboard();
      setDashboard(res);
    } catch (e) {
      console.error("Fetch dashboard failed:", e);
      setError("Không thể tải bảng thống kê.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
};

