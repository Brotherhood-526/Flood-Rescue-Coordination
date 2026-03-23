import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authService, parseStaffFromResponse } from "@/services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setStaff = useAuthStore((s) => s.setStaff);
  const clearStaff = useAuthStore((s) => s.clearStaff);
  const staff = useAuthStore((s) => s.staff);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);
      const res = await authService.login({ phone, password });

      const staffData = parseStaffFromResponse(res);
      if (!staffData) {
        console.error("AUTH", res);
        return null;
      }

      localStorage.setItem("userRole", staffData.role);
      localStorage.setItem("staff", JSON.stringify(staffData));
      setStaff(staffData);

      return staffData;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearStaff();
      localStorage.removeItem("userRole");
      localStorage.removeItem("staff");
      setLoading(false);
      navigate("/login");
    }
  };

  return { staff, login, logout, loading };
}
