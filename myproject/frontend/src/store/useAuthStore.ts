import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isLoggedIn: () => boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      _hasHydrated: false,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
      isLoggedIn: () => get().accessToken !== null,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
