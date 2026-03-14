import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/axiosClient";
import { useAuthStore, type Staff } from "@/store/authStore";

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === "string";

const isNullableNumber = (value: unknown): value is number | null =>
  value === null || typeof value === "number";

const isStaffShape = (value: unknown): value is Staff => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.accountId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.role === "string" &&
    isNullableString(candidate.teamName) &&
    isNullableNumber(candidate.teamSize) &&
    isNullableNumber(candidate.latitude) &&
    isNullableNumber(candidate.longitude)
  );
};

const getStaffFromLoginResponse = (payload: unknown): Staff | null => {
  if (!payload || typeof payload !== "object") return null;

  const candidate = payload as Record<string, unknown>;

  if (isStaffShape(candidate)) return candidate;

  const nested = candidate.data;
  if (isStaffShape(nested)) return nested;

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
        console.error("Unexpected login response shape for login attempt", {
          code: "AUTH_RESP_MALFORMED",
        });
        return null;
      }

      localStorage.setItem("userRole", staffData.role);
      localStorage.setItem("staff", JSON.stringify(staffData));

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
      localStorage.removeItem("staff");
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
