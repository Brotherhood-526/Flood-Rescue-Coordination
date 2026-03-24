import { useCallback, useEffect, useMemo, useState } from "react";
import { managerService } from "@/services/Manager/managerService";
import type { ManagerStaff } from "@/types/manager";

export const useManagerStaff = (search: string) => {
  const normalizedSearch = useMemo(
    () => (search ?? "").trim() || undefined,
    [search],
  );

  const [pageNumber, setPageNumber] = useState(0);
  const [staffList, setStaffList] = useState<ManagerStaff[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPageNumber(0);
  }, [normalizedSearch]);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await managerService.getStaff({
        search: normalizedSearch,
        page: pageNumber,
      });

      setStaffList(res.content ?? []);
      setTotalPage(res.totalPages ?? 0);
    } catch (e) {
      console.error("Fetch staff failed:", e);
      setError("Không thể tải danh sách nhân viên.");
    } finally {
      setLoading(false);
    }
  }, [normalizedSearch, pageNumber]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handlePageChange = (left: boolean) => {
    setPageNumber((prev) => {
      if (totalPage <= 0) return 0;
      if (left) return Math.max(0, prev - 1);
      return Math.min(totalPage - 1, prev + 1);
    });
  };

  return {
    pageNumber,
    staffList,
    totalPage,
    loading,
    error,
    refetch: fetchStaff,
    handlePageChange,
  };
};

