import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: (User & { point?: number }) | null;
  accessToken: string | null;
  neighborhood: string | null; // 동네 (예: "역삼동")
  isLoggedIn: boolean;
}

interface AuthActions {
  login: (user: User & { point?: number }, token: string, neighborhood?: string) => void;
  logout: () => void;
  setNeighborhood: (name: string) => void;
  updatePoint: (point: number) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      neighborhood: null,
      isLoggedIn: false,

      login: (user, token, neighborhood) => {
        // apiInstance interceptor가 localStorage에서 읽으므로 여기도 저장
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }
        set({ user, accessToken: token, isLoggedIn: true, neighborhood: neighborhood ?? null });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({ user: null, accessToken: null, isLoggedIn: false, neighborhood: null });
      },

      setNeighborhood: (name) => set({ neighborhood: name }),

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
        isLoggedIn: s.isLoggedIn,
      }),
    },
  ),
);

export const selectUser         = (s: AuthState & AuthActions) => s.user;
export const selectIsLoggedIn   = (s: AuthState & AuthActions) => s.isLoggedIn;
export const selectNeighborhood = (s: AuthState & AuthActions) => s.neighborhood;
// 본인 이메일 추가하면 관리자 권한 부여
const ADMIN_EMAILS: string[] = ["abc123@naver.com"];
export const selectIsAdmin = (s: AuthState & AuthActions) =>
  s.user?.type === "admin" || ADMIN_EMAILS.includes(s.user?.email ?? "");
