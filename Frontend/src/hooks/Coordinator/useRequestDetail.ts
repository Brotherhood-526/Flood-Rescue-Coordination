import { useEffect, useState, useCallback } from "react";
import { coordinatorService } from "@/services/Coordinator/coordinatorService";
import type { RequestDetail } from "@/types/coordinator";

// Hook này dùng để lấy thông tin chi tiết của một yêu cầu từ server
// Tham số id: mã định danh của yêu cầu cần lấy
export const useRequestDetail = (id: string) => {
  // State là "bộ nhớ" của component — khi state thay đổi, giao diện tự cập nhật
  // const là biến ko thể gán lại
  // Lưu dữ liệu chi tiết yêu cầu trả về từ server (null = chưa có dữ liệu)
  const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // useCallback giúp React KHÔNG tạo lại hàm này mỗi lần render
  // (chỉ tạo lại khi "id" thay đổi — xem mảng [id] ở cuối)
  //async dùng để đánh dấu một function là bất đồng bộ tức là function đó có thể chứa await bên trong
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
  }, [id]); // Chỉ tạo lại hàm khi "id" thay đổi

  // useEffect chạy code "có tác dụng phụ" (gọi API, thao tác DOM, ...)
  // Mảng [fetchRequestDetail] = chỉ chạy lại khi hàm fetchRequestDetail thay đổi
  // → Mà hàm đó chỉ thay đổi khi "id" thay đổi → Gọi lại API khi id thay đổi
  useEffect(() => {
    fetchRequestDetail();
  }, [fetchRequestDetail]);

  // Dữ liệu chi tiết , refecth để gọi lại API thủ công
  return { requestDetail, loading, error, refetch: fetchRequestDetail };
};
