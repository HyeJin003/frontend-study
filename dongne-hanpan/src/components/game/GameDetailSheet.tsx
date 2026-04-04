"use client";

import { motion, AnimatePresence } from "framer-motion";
import HapticButton from "@/components/ui/HapticButton";
import type { Post } from "@/types";

const SPORT_EMOJI: Record<string, string> = {
  축구: "⚽", 농구: "🏀", 배드민턴: "🏸", 테니스: "🎾",
  러닝: "🏃", 헬스: "💪", 기타: "🏅",
};
const SPORT_COLOR: Record<string, string> = {
  축구: "#22C55E", 농구: "#F97316", 배드민턴: "#3B82F6",
  테니스: "#EAB308", 러닝: "#EC4899", 헬스: "#8B5CF6", 기타: "#FF8200",
};

interface GameDetailSheetProps {
  game: Post | null;
  onClose: () => void;
  onJoin: (game: Post) => void;
  isJoining: boolean;
}

export default function GameDetailSheet({ game, onClose, onJoin, isJoining }: GameDetailSheetProps) {
  return (
    <AnimatePresence>
      {game && (
        <>
          {/* 딤 */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 시트 */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 rounded-t-3xl border-t border-white/10 overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <GameDetail game={game} onClose={onClose} onJoin={onJoin} isJoining={isJoining} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function GameDetail({ game, onClose, onJoin, isJoining }: GameDetailSheetProps & { game: Post }) {
  const extra = game.extra as Record<string, unknown>;
  const sport     = (extra?.sport as string) ?? "기타";
  const location  = (extra?.location as string) ?? "장소 미정";
  const date      = (extra?.date as string) ?? "";
  const maxP      = (extra?.maxPlayers as number) ?? 0;
  // 방장(1명) + replies 수로 현재 참가자 계산
  const curP      = 1 + (game.replies?.length ?? 0);
  const isFull    = maxP > 0 && curP >= maxP;
  const color     = SPORT_COLOR[sport] ?? "#FF8200";
  const emoji     = SPORT_EMOJI[sport] ?? "🏅";
  const fillPct   = maxP > 0 ? (curP / maxP) * 100 : 0;

  const dateLabel = date
    ? new Date(date).toLocaleDateString("ko-KR", {
        month: "long", day: "numeric",
        weekday: "short", hour: "2-digit", minute: "2-digit",
      })
    : "날짜 미정";

  return (
    <div className="px-5 pt-2 pb-8 space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: `${color}22`, border: `2px solid ${color}44` }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
        >
          {emoji}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-lg leading-tight">{game.title}</p>
          <p className="text-white/50 text-sm mt-0.5">{sport}</p>
        </div>
      </div>

      {/* 정보 카드들 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: "📍", label: "장소", value: location },
          { icon: "🕐", label: "일시",  value: dateLabel },
        ].map((item) => (
          <div key={item.label} className="bg-neutral-800 rounded-xl px-3 py-2.5">
            <p className="text-white/40 text-xs mb-0.5">{item.icon} {item.label}</p>
            <p className="text-white text-xs font-semibold leading-snug">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 인원 현황 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/50 text-xs font-semibold">인원 현황</span>
          <span className="font-black text-sm" style={{ color }}>
            {curP} / {maxP}명
          </span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isFull ? "#EF4444" : color }}
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="text-white/30 text-xs mt-1.5">
          {isFull ? "😢 자리가 꽉 찼어요" : `😊 ${maxP - curP}자리 남았어요`}
        </p>
      </div>

      {/* 내용 */}
      {game.content && (
        <p className="text-white/60 text-sm leading-relaxed bg-neutral-800 rounded-xl px-4 py-3">
          {game.content}
        </p>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        <HapticButton
          haptic="light"
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl bg-neutral-800 text-white/60 font-bold text-sm"
        >
          닫기
        </HapticButton>
        <HapticButton
          haptic={isFull ? "error" : "success"}
          disabled={isFull || isJoining}
          onClick={() => onJoin(game)}
          className="flex-[2] py-3.5 rounded-2xl font-black text-white text-sm disabled:opacity-40"
          style={!isFull ? {
            background: color,
            boxShadow: `0 4px 20px ${color}50`,
          } : { background: "#374151" }}
        >
          {isJoining ? "참가 중..." : isFull ? "마감됨" : "⚡ 지금 참가하기"}
        </HapticButton>
      </div>
    </div>
  );
}
