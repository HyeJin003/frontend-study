import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://koyeb.app",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    "client-id": "febc15-final03-ecad",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 액세스 토큰이 있으면 Authorization 헤더에 주입
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────────────────────────
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 → 로컬 토큰 제거 후 로그인 페이지로
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
