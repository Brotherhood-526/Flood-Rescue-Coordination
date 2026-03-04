import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/axiosClient";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/router/routes";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);

      const res = await apiClient.post("/auth/login", {
        phone,
        password,
      });

      console.log(res);
      const user = res.data.data;
      
      setUser(user);

      if (user.role === "coordinate") {
        navigate(ROUTES.COORDINATE);
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
    return user;
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