"use client";

import { memo } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { motion } from "framer-motion";
import type { Post } from "@/types";

const SPORT_EMOJI: Record<string, string> = {
  축구: "⚽", 농구: "🏀", 배드민턴: "🏸", 테니스: "🎾",
  러닝: "🏃", 헬스: "💪", 기타: "🏅",
};

const SPORT_COLOR: Record<string, string> = {
  축구: "#22C55E", 농구: "#F97316", 배드민턴: "#3B82F6",
  테니스: "#EAB308", 러닝: "#EC4899", 헬스: "#8B5CF6", 기타: "#FF8200",
};

interface GameMarkerProps {
  game: Post;
  isSelected: boolean;
  onClick: (game: Post) => void;
}

const GameMarker = memo(function GameMarker({ game, isSelected, onClick }: GameMarkerProps) {
  const extra = game.extra as Record<string, unknown> | undefined;
  const sport = (extra?.sport as string) ?? "기타";
  const maxPlayers = (extra?.maxPlayers as number) ?? 0;
  const currentPlayers = (extra?.currentPlayers as number) ?? 0;
  const isFull = maxPlayers > 0 && currentPlayers >= maxPlayers;

  const emoji = SPORT_EMOJI[sport] ?? "🏅";
  const color = SPORT_COLOR[sport] ?? "#FF8200";

  // 게임 위치가 없으면 렌더 스킵
  const lat = extra?.lat as number | undefined;
  const lng = extra?.lng as number | undefined;
  if (!lat || !lng) return null;

  return (
    <CustomOverlayMap position={{ lat, lng }} yAnchor={1.2}>
      <div className="flex flex-col items-center select-none cursor-pointer" onClick={() => onClick(game)}>

        {/* 선택됐을 때 확대 링 */}
        {isSelected && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -8, border: `2px solid ${color}` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        )}

        {/* 레이더 펄스 링 — 포켓몬고 포켓스톱 느낌 */}
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            className="absolute rounded-full pointer-events-none"
            style={{ inset: 0, border: `1.5px solid ${color}` }}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* 메인 마커 공 — 위아래 둥둥 */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 1.25 }}
        >
          <motion.div
            className="relative flex items-center justify-center rounded-full border-2 shadow-xl"
            style={{
              width: isSelected ? 58 : 50,
              height: isSelected ? 58 : 50,
              background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88)`,
              borderColor: color,
              boxShadow: `0 4px 20px ${color}60`,
              transition: "width 0.2s, height 0.2s",
            }}
          >
            <span className="text-2xl">{emoji}</span>

            {/* 인원 배지 — 포켓몬 CP 숫자 느낌 */}
            <div
              className="absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-[10px] font-black text-white min-w-[20px] text-center"
              style={{ background: isFull ? "#EF4444" : "#1a1a1a", border: `1px solid ${color}` }}
            >
              {isFull ? "마감" : `${currentPlayers}/${maxPlayers}`}
            </div>
          </motion.div>
        </motion.div>

        {/* 그림자 */}
        <motion.div
          className="rounded-full mt-1"
          style={{ width: 28, height: 6, background: `${color}40`, filter: "blur(3px)" }}
          animate={{ scaleX: [1, 0.75, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </CustomOverlayMap>
  );
});

export default GameMarker;
