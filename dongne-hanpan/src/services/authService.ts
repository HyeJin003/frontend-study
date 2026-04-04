import apiInstance from "./apiInstance";
import type { User } from "@/types";

interface LoginResponse {
  item: {
    _id: number;
    email: string;
    name: string;
    type: string;
    token: { accessToken: string; refreshToken: string };
  };
}
interface MeResponse {
  item: User & { point: number };
}

export const authService = {
  async login(email: string, password: string) {
    const res = await apiInstance.post<LoginResponse>("/users/login", {
      email,
      password,
    });
    const { token, ...user } = res.data.item;
    return { token: token.accessToken, user };
  },

  async getMe(userId: number) {
    const res = await apiInstance.get<MeResponse>(`/users/${userId}`);
    return res.data.item;
  },

  async signup(email: string, password: string, name: string) {
    const res = await apiInstance.post<{ item: User }>("/users", {
      email,
      password,
      name,
      type: "user",
    });
    return res.data.item;
  },
};
