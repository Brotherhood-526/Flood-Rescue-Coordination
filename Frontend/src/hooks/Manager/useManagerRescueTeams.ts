import { useCallback, useEffect, useMemo, useState } from "react";
import { managerService } from "@/services/Manager/managerService";
import type { ManagerTeam } from "@/types/manager";

export const useManagerRescueTeams = (params?: {
  search?: string;
}) => {
  const normalizedSearch = useMemo(
    () => (params?.search ?? "").trim() || undefined,
    [params?.search],
  );

  const [teamList, setTeamList] = useState<ManagerTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await managerService.getRescueTeams({
        search: normalizedSearch,
      });

      setTeamList(res.content ?? []);
    } catch (e) {
      console.error("Fetch rescue teams failed:", e);
      setError("Không thể tải danh sách đội cứu hộ.");
    } finally {
      setLoading(false);
    }
  }, [normalizedSearch]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teamList,
    loading,
    error,
    refetch: fetchTeams,
  };
};

