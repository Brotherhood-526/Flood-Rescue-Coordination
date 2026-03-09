import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Staff {
  accountId: string;
  name: string;
  phone: string;
  role: string;
  teamName: string | null;
  teamSize: number | null;
  latitude: number | null;
  longitude: number | null;
}

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
