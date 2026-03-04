import { create } from "zustand";

export interface User {
  accountId: string;
  phone: string;
  role: string;
  name: string;
  teamName: string;
  teamSize: number;
  latitude: number | null;
  longitude: number | null;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));