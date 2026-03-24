import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authService, parseStaffFromResponse } from "@/services/authService";

export function useAuth() {
  // ─── State & Utilities ───────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy các hàm và dữ liệu từ global store (Zustand)
  const staff = useAuthStore((state) => state.staff);
  const setStaff = useAuthStore((state) => state.setStaff);
  const clearStaff = useAuthStore((state) => state.clearStaff);

  /** Lưu thông tin nhân viên vào localStorage để giữ đăng nhập khi F5 */
  function saveStaffToLocalStorage(
    staffData: ReturnType<typeof parseStaffFromResponse>,
  ) {
    if (!staffData) return;
    localStorage.setItem("userRole", staffData.role);
    localStorage.setItem("staff", JSON.stringify(staffData));
  }

  /** Xoá thông tin nhân viên khỏi localStorage khi đăng xuất */
  function removeStaffFromLocalStorage() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("staff");
  }

  const login = async (phone: string, password: string) => {
    setLoading(true);

    try {
      //  Gọi API đăng nhập, xài await của js để đợi API của BE trả r mới chạy tiếp
      const response = await authService.login({ phone, password });

      // Chuyển đổi response thành object nhân viên
      const staffData = parseStaffFromResponse(response);

      // Kiểm tra nếu parse thất bại (response không hợp lệ)
      if (!staffData) {
        console.error("Không parse được dữ liệu nhân viên", response);
        return null;
      }

      // Lưu vào localStorage (để giữ session khi reload trang)
      saveStaffToLocalStorage(staffData);

      // Lưu vào global store (để các component khác dùng được)
      setStaff(staffData);

      return staffData;
    } catch (error) {
      console.error("[useAuth] Đăng nhập thất bại:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      // Gọi API logout phía server
      await authService.logout();
    } catch (error) {
      // Dù API lỗi vẫn tiến hành đăng xuất phía client
      console.error(
        "[useAuth] API logout thất bại, vẫn tiến hành đăng xuất:",
        error,
      );
    } finally {
      // Luôn dọn dẹp dữ liệu và chuyển trang dù API có lỗi hay không
      clearStaff();
      removeStaffFromLocalStorage();
      setLoading(false);
      navigate("/login");
    }
  };

  // ─── Exports ─────────────────────────────────────────────────────────────────
  return { staff, login, logout, loading };
}
