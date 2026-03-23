import { useEffect, useState, useCallback } from "react";
import { coordinatorService } from "@/services/Coordinator/coordinatorService";
import type { RequestDetail } from "@/types/coordinator";

export const useRequestDetail = (id: string) => {
  const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequestDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await coordinatorService.getRequestDetail(id);
      setRequestDetail(res);
    } catch (err) {
      console.error("Fetch request detail failed:", err);
      setError("Không thể tải chi tiết yêu cầu.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetail();
  }, [fetchRequestDetail]);

  return { requestDetail, loading, error, refetch: fetchRequestDetail };
};
