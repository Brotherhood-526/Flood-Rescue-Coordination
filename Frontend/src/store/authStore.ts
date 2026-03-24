import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Staff } from "@/types/auth";

interface AuthState {
  staff: Staff | null;
  setStaff: (staff: Staff) => void;
  clearStaff: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      staff: null,
      setStaff: (staff) => set({ staff }),
      clearStaff: () => set({ staff: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
