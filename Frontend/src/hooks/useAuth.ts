import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/axiosClient";
import { useAuthStore, type Staff } from "@/store/authStore";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setStaff = useAuthStore((state) => state.setStaff);
  const clearStaff = useAuthStore((state) => state.clearStaff);
  const staff = useAuthStore((state) => state.staff);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);
      const res = await apiClient.post("/auth/login", {
        phone,
        password,
      });

      const staffData = res as unknown as Staff;

      // BẮT BUỘC PHẢI LƯU VÀO LOCAL STORAGE ĐỂ PROTECTED ROUTE NHẬN DIỆN ĐƯỢC
      // Tùy vào việc BE trả về có token hay không. Nếu có token thì lưu token.
      // Nếu BE TẠM THỜI chưa có token,lưu tạm thông tin user:
      localStorage.setItem("userRole", staffData.role);

      console.log("Dữ liệu login trả về:", staffData);
      setStaff(staffData);

      return staffData;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearStaff();
    // localStorage.removeItem("accessToken"); // Xóa token khi đăng xuất
    navigate("/login");
  };

  return {
    staff,
    login,
    logout,
    loading,
  };
}
