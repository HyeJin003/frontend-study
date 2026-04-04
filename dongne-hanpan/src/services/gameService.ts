import apiInstance from "./apiInstance";
import type { Post } from "@/types";

interface PostListResponse {
  item: Post[];
}
interface PostResponse {
  item: Post;
}

export interface CreateGamePayload {
  title: string;
  content: string;
  sport: string;
  location: string;
  date: string;
  maxPlayers: number;
  lat: number;
  lng: number;
}

export const gameService = {
  async getGames(): Promise<Post[]> {
    const res = await apiInstance.get<PostListResponse>("/posts", {
      params: { type: "game", limit: 20, page: 1 },
    });
    return res.data.item ?? [];
  },

  async deleteGame(id: number): Promise<void> {
    await apiInstance.delete(`/posts/${id}`);
  },

  async createGame(payload: CreateGamePayload): Promise<Post> {
    const res = await apiInstance.post<PostResponse>("/posts", {
      type: "game",
      title: payload.title,
      content: payload.content,
      extra: {
        sport: payload.sport,
        location: payload.location,
        date: payload.date,
        maxPlayers: payload.maxPlayers,
        currentPlayers: 1,
        lat: payload.lat,   // 지도 마커 위치
        lng: payload.lng,
      },
    });
    return res.data.item;
  },
};
