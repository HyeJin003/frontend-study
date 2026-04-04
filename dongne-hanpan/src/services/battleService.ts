import apiInstance from "./apiInstance";
import type { Post, Reply } from "@/types";

export interface BattleRoom {
  _id: number;
  title: string;
  user_id: number;
  user: { _id: number; name: string; profileImage?: string };
  extra: {
    sport: string;
    neighborhood: string;
    totalCount: number;
    deadline: string;
  };
  replies?: Reply[];
  createdAt: string;
  updatedAt: string;
}

export const SPORT_LIST = [
  { key: "줄넘기",    emoji: "🪢" },
  { key: "팔굽혀펴기", emoji: "💪" },
  { key: "스쿼트",   emoji: "🏋️" },
  { key: "달리기",   emoji: "🏃" },
  { key: "농구",    emoji: "🏀" },
  { key: "축구",    emoji: "⚽" },
  { key: "배드민턴", emoji: "🏸" },
];

export function sportEmoji(sport: string): string {
  return SPORT_LIST.find((s) => s.key === sport)?.emoji ?? "🏅";
}

export const battleService = {
  async getBattles(): Promise<BattleRoom[]> {
    const res = await apiInstance.get<{ item: Post[] }>("/posts", {
      params: { type: "battle", limit: 30, page: 1 },
    });
    return (res.data.item ?? []) as unknown as BattleRoom[];
  },

  async getBattle(id: number): Promise<BattleRoom> {
    const res = await apiInstance.get<{ item: Post }>(`/posts/${id}`);
    return res.data.item as unknown as BattleRoom;
  },

  async createBattle(
    sport: string,
    neighborhood: string,
    deadline: string,
  ): Promise<BattleRoom> {
    const res = await apiInstance.post<{ item: Post }>("/posts", {
      type: "battle",
      title: `[${neighborhood}] ${sport} 배틀`,
      content: `${neighborhood} 주민들의 ${sport} 배틀! 운동 횟수를 인증하고 동네 땅을 차지하세요.`,
      extra: {
        sport,
        neighborhood,
        totalCount: 0,
        deadline,
      },
    });
    return res.data.item as unknown as BattleRoom;
  },

  async deleteBattle(id: number): Promise<void> {
    await apiInstance.delete(`/posts/${id}`);
  },

  /** 운동 횟수 인증 — reply에 count 저장 */
  async certify(battleId: number, count: number): Promise<Reply> {
    const res = await apiInstance.post<{ item: Reply }>(
      `/posts/${battleId}/replies`,
      {
        content: `${count}회 인증 완료! 💪`,
        extra: { count },
      },
    );
    return res.data.item;
  },

  /** 동네별 총 인증 점수 계산 */
  async getNeighborhoodScores(): Promise<Record<string, number>> {
    const battles = await battleService.getBattles();
    const scores: Record<string, number> = {};
    for (const b of battles) {
      const nh = b.extra?.neighborhood ?? "알 수 없음";
      const cnt = Number(b.extra?.totalCount ?? 0);
      scores[nh] = (scores[nh] ?? 0) + cnt;
    }
    return scores;
  },
};
