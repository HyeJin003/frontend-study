import { useAuthStore } from "@/store/useAuthStore";
import { PublicMemberProfile } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const BASE_URL = "http://localhost:8080";

function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getPublicProfile(
  nickname: string
): Promise<ApiResponse<PublicMemberProfile>> {
  const res = await fetch(`${BASE_URL}/api/members/${nickname}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("프로필 조회 실패");
  return res.json();
}
