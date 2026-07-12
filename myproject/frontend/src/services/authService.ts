import { useAuthStore } from "@/store/useAuthStore";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface MemberResponse {
  id: number;
  email: string;
  nickname: string;
  provider: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface UpdateMeRequest {
  nickname?: string;
  bio?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const BASE_URL = "http://localhost:8080";

function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    if (res.status === 401) useAuthStore.getState().clearAuth();
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function login(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
  return apiFetch<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signup(data: SignupRequest): Promise<ApiResponse<TokenResponse>> {
  return apiFetch<TokenResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<ApiResponse<MemberResponse>> {
  return apiFetch<MemberResponse>("/api/auth/me");
}

export async function logout(): Promise<ApiResponse<null>> {
  return apiFetch<null>("/api/auth/logout", { method: "POST" });
}

export async function updateMe(data: UpdateMeRequest): Promise<ApiResponse<MemberResponse>> {
  return apiFetch<MemberResponse>("/api/members/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
  return apiFetch<null>("/api/members/me/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteMe(): Promise<ApiResponse<null>> {
  return apiFetch<null>("/api/members/me", { method: "DELETE" });
}
