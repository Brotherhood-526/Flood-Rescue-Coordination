import { useCallback, useEffect, useMemo, useState } from "react";
import { managerService } from "@/services/Manager/managerService";
import type { ManagerVehicle } from "@/types/manager";

export const useManagerVehicles = (params?: {
  search?: string;
}) => {
  const normalizedSearch = useMemo(
    () => (params?.search ?? "").trim() || undefined,
    [params?.search],
  );

  const [vehicleList, setVehicleList] = useState<ManagerVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await managerService.getVehicles({
        search: normalizedSearch,
      });

      setVehicleList(res.content ?? []);
    } catch (e) {
      console.error("Fetch vehicles failed:", e);
      setError("Không thể tải danh sách phương tiện.");
    } finally {
      setLoading(false);
    }
  }, [normalizedSearch]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicleList,
    loading,
    error,
    refetch: fetchVehicles,
  };
};

