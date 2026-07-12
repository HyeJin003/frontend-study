import { useAuthStore } from './../store/useAuthStore';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";


async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    redirect: 'error',
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: "GET", ...options }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
