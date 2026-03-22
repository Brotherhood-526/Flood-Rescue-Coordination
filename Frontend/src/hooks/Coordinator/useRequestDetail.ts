import { useEffect, useState, useCallback } from "react";
import apiClient from "@/services/axiosClient";
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
      const res = (await apiClient.post("/coordinator/takeSpecificRequest", {
        id,
      })) as unknown as RequestDetail;
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
