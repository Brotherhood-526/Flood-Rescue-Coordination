import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/axiosClient";
import { useAuthStore, type Staff } from "@/store/authStore";

const getStaffFromLoginResponse = (payload: unknown): Staff | null => {
  if (!payload || typeof payload !== "object") return null;

  const candidate = payload as Record<string, unknown>;

  const directRole = candidate.role;
  if (typeof directRole === "string") return candidate as unknown as Staff;

  const nested = candidate.data;
  if (nested && typeof nested === "object") {
    const nestedObj = nested as Record<string, unknown>;
    if (typeof nestedObj.role === "string") {
      return nestedObj as unknown as Staff;
    }
  }

  return null;
};

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

      const staffData = getStaffFromLoginResponse(res);
      if (!staffData) {
        console.error("Unexpected login response shape:", res);
        return null;
      }

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

  const logout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearStaff();
      localStorage.removeItem("userRole");
      setLoading(false);
      navigate("/login");
    }
  };

  return {
    staff,
    login,
    logout,
    loading,
  };
}
