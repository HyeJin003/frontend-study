import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: (User & { point?: number }) | null;
  accessToken: string | null;
  neighborhood: string | null; // 동 (예: "역삼동")
  city: string | null;         // 시/구 (예: "강남구", "시흥시")
  isLoggedIn: boolean;
}

interface AuthActions {
  login: (user: User & { point?: number }, token: string, neighborhood?: string) => void;
  logout: () => void;
  setNeighborhood: (name: string, city?: string) => void;
  updatePoint: (point: number) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      neighborhood: null,
      city: null,
      isLoggedIn: false,

      login: (user, token, neighborhood) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }
        set({ user, accessToken: token, isLoggedIn: true, neighborhood: neighborhood ?? null });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({ user: null, accessToken: null, isLoggedIn: false, neighborhood: null, city: null });
      },

      setNeighborhood: (name, city) =>
        set({ neighborhood: name, ...(city !== undefined ? { city } : {}) }),

      updatePoint: (point) =>
        set((s) => ({
          user: s.user ? { ...s.user, point } : s.user,
        })),
    }),
    {
      name: "dongne-auth",
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        neighborhood: s.neighborhood,
        city: s.city,
        isLoggedIn: s.isLoggedIn,
      }),
    },
  ),
);

export const selectUser         = (s: AuthState & AuthActions) => s.user;
export const selectIsLoggedIn   = (s: AuthState & AuthActions) => s.isLoggedIn;
export const selectNeighborhood = (s: AuthState & AuthActions) => s.neighborhood;
export const selectCity         = (s: AuthState & AuthActions) => s.city;
const ADMIN_EMAILS: string[] = ["abc123@naver.com"];
export const selectIsAdmin = (s: AuthState & AuthActions) =>
  s.user?.type === "admin" || ADMIN_EMAILS.includes(s.user?.email ?? "");
