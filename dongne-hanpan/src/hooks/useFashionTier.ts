"use client";

import { useQuery } from "@tanstack/react-query";
import apiInstance from "@/services/apiInstance";
import type { AvatarTier } from "@/types";
import { AVATAR_TIER_THRESHOLD } from "@/types";

interface PostListResponse {
  item: unknown[];
  pagination: { total: number };
}

/** 유저 게시글 수를 조회해 AvatarTier를 결정하는 훅 */
export function useFashionTier(userId: number | null) {
  const { data: postCount, isLoading } = useQuery({
    queryKey: ["fashionTier", userId],
    queryFn: async () => {
      // limit=1로 최소 트래픽으로 total 값만 가져옴
      const res = await apiInstance.get<PostListResponse>("/posts", {
        params: { user_id: userId, limit: 1, page: 1 },
      });
      return res.data.pagination?.total ?? 0;
    },
    enabled: userId !== null,
    staleTime: 1000 * 60 * 5, // 5분 캐시 — 마커가 불필요하게 re-fetch되지 않도록
    placeholderData: 0,
  });

  const tier = calcTier(postCount ?? 0);

  return { tier, postCount: postCount ?? 0, isLoading };
}

function calcTier(count: number): AvatarTier {
  if (count >= AVATAR_TIER_THRESHOLD.FASHIONISTA) return "FASHIONISTA";
  if (count >= AVATAR_TIER_THRESHOLD.NORMAL) return "NORMAL";
  return "TERRORIST";
}
