import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/axiosClient";
import { useAuthStore, type User } from "@/store/authStore";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);

      const user = await apiClient.post("/auth/login", {
        phone,
        password,
      }) as User;

      console.log(user);
      // const user = res.data;

      setUser(user);

      return user;

    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }

  };

  const logout = () => {
    clearUser();
    navigate("/login");
  };

  return {
    user,
    login,
    logout,
    loading,
  };
}