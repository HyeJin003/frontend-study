import type { AvatarTier } from "@/types";

export interface TierVisual {
  label: string;
  emoji: string;
  /** 아바타 테두리 색 */
  borderColor: string;
  /** 배경 그라데이션 (CSS value) */
  avatarGradient: string;
  /** 말풍선 배경색 */
  badgeBg: string;
  /** 말풍선 텍스트 색 */
  badgeText: string;
  /** 마커 꼬리 색 */
  tailColor: string;
}

export const TIER_VISUAL: Record<AvatarTier, TierVisual> = {
  FASHIONISTA: {
    label: "패피",
    emoji: "👑",
    borderColor: "#FFD700",
    avatarGradient: "linear-gradient(135deg, #FFD700 0%, #FF8200 100%)",
    badgeBg: "#1a1200",
    badgeText: "#FFD700",
    tailColor: "#FFD700",
  },
  NORMAL: {
    label: "동네주민",
    emoji: "🏃",
    borderColor: "#FF8200",
    avatarGradient: "linear-gradient(135deg, #FF8200 0%, #CC6800 100%)",
    badgeBg: "#1a0800",
    badgeText: "#FF8200",
    tailColor: "#FF8200",
  },
  TERRORIST: {
    label: "패션테러",
    emoji: "🤧",
    borderColor: "#6B9E3C",
    avatarGradient: "linear-gradient(135deg, #4a6e28 0%, #2d4a12 100%)",
    badgeBg: "#0d1a00",
    badgeText: "#a3c96e",
    tailColor: "#6B9E3C",
  },
};
