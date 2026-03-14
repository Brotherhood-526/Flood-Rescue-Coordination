import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/axiosClient";
import { useAuthStore, type Staff } from "@/store/authStore";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const parseNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized === "null" ? null : value;
};

const parseNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized || normalized === "null") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const pick = (source: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in source) return source[key];
  }
  return undefined;
};

const parseStaff = (value: unknown): Staff | null => {
  const candidate = asRecord(value);
  if (!candidate) return null;

  const accountIdValue = pick(candidate, ["accountId", "account_id", "id"]);
  const nameValue = pick(candidate, ["name"]);
  const phoneValue = pick(candidate, ["phone"]);
  const roleValue = pick(candidate, ["role"]);
  const teamNameValue = pick(candidate, ["teamName", "team_name"]);
  const teamSizeValue = pick(candidate, ["teamSize", "team_size"]);
  const latitudeValue = pick(candidate, ["latitude", "lat"]);
  const longitudeValue = pick(candidate, ["longitude", "lng"]);

  if (
    typeof accountIdValue !== "string" ||
    typeof nameValue !== "string" ||
    typeof phoneValue !== "string" ||
    typeof roleValue !== "string"
  ) {
    return null;
  }

  return {
    accountId: accountIdValue,
    name: nameValue,
    phone: phoneValue,
    role: roleValue,
    teamName: parseNullableString(teamNameValue),
    teamSize: parseNullableNumber(teamSizeValue),
    latitude: parseNullableNumber(latitudeValue),
    longitude: parseNullableNumber(longitudeValue),
  };
};

const getStaffFromLoginResponse = (payload: unknown): Staff | null => {
  const candidate = asRecord(payload);
  if (!candidate) return null;

  const topLevel = parseStaff(candidate);
  if (topLevel) return topLevel;

  const nestedData = asRecord(candidate.data);
  if (nestedData) {
    const nestedLevel = parseStaff(nestedData);
    if (nestedLevel) return nestedLevel;

    const deepNestedLevel = parseStaff(nestedData.data);
    if (deepNestedLevel) return deepNestedLevel;
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
        console.error("Unexpected login response shape for login attempt", {
          code: "AUTH_RESP_MALFORMED",
        });
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
