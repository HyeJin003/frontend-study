"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { battleService, SPORT_LIST, sportEmoji, type BattleRoom } from "@/services/battleService";
import { useAuthStore, selectNeighborhood } from "@/store/useAuthStore";
import HapticButton from "@/components/ui/HapticButton";

const BATTLES_KEY = ["battles"] as const;

const SPORT_COLORS: Record<string, string> = {
  줄넘기: "#FF8200",
  팔굽혀펴기: "#EF4444",
  스쿼트: "#8B5CF6",
  달리기: "#10B981",
  농구: "#F59E0B",
  축구: "#3B82F6",
  배드민턴: "#EC4899",
};

function sportColor(sport: string) {
  return SPORT_COLORS[sport] ?? "#FF8200";
}

export default function BattlePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const myNeighborhood = useAuthStore(selectNeighborhood) ?? "내 동네";

  const [filterSport, setFilterSport] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createSport, setCreateSport] = useState(SPORT_LIST[0].key);
  const [deadlineDays, setDeadlineDays] = useState(3);

  const { data: battles = [], isLoading } = useQuery({
    queryKey: BATTLES_KEY,
    queryFn: battleService.getBattles,
    refetchInterval: 30_000,
  });

  const { mutate: createBattle, isPending: isCreating } = useMutation({
    mutationFn: () => {
      const deadline = new Date(Date.now() + deadlineDays * 86400_000).toISOString();
      return battleService.createBattle(createSport, myNeighborhood, deadline);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BATTLES_KEY });
      setShowCreate(false);
    },
  });

  const filtered = filterSport
    ? battles.filter((b) => b.extra?.sport === filterSport)
    : battles;

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* 헤더 */}
      <motion.header
        className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 px-4 py-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-white/50 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="font-black text-lg">동네 배틀 ⚔️</h1>
              <p className="text-white/40 text-xs">{myNeighborhood} · 운동 인증으로 땅 차지!</p>
            </div>
          </div>
          <HapticButton
            haptic="medium"
            onClick={() => setShowCreate(true)}
            className="bg-brand text-white text-sm font-bold px-4 py-2 rounded-xl"
          >
            + 방 열기
          </HapticButton>
        </div>

        {/* 종목 필터 */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilterSport(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              !filterSport ? "bg-brand text-white" : "bg-white/10 text-white/50"
            }`}
          >
            전체 {battles.length}
          </button>
          {SPORT_LIST.map((s) => {
            const cnt = battles.filter((b) => b.extra?.sport === s.key).length;
            if (cnt === 0) return null;
            return (
              <button
                key={s.key}
                onClick={() => setFilterSport(filterSport === s.key ? null : s.key)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterSport === s.key ? "text-white shadow-md" : "bg-white/10 text-white/50"
                }`}
                style={filterSport === s.key ? { backgroundColor: sportColor(s.key) } : undefined}
              >
                <span>{s.emoji}</span>
                <span>{s.key}</span>
                <span className="opacity-60">{cnt}</span>
              </button>
            );
          })}
        </div>
      </motion.header>

      {/* 내 동네 점수 배너 */}
      <NeighborhoodScoreBanner myNeighborhood={myNeighborhood} />

      {/* 배틀 목록 */}
      <div className="px-4 pt-4 space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-neutral-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-5xl mb-3">⚔️</p>
            <p className="text-white/60 font-bold">아직 배틀이 없어요</p>
            <p className="text-white/30 text-sm mt-1">+ 방 열기로 첫 배틀을 시작해봐요!</p>
          </motion.div>
        )}

        {filtered.map((battle, i) => (
          <BattleCard
            key={battle._id}
            battle={battle}
            myNeighborhood={myNeighborhood}
            index={i}
            onClick={() => router.push(`/battle/${battle._id}`)}
          />
        ))}
      </div>

      {/* 방 만들기 시트 */}
      <AnimatePresence>
        {showCreate && (
          <CreateBattleSheet
            sport={createSport}
            setSport={setCreateSport}
            deadlineDays={deadlineDays}
            setDeadlineDays={setDeadlineDays}
            isPending={isCreating}
            myNeighborhood={myNeighborhood}
            onClose={() => setShowCreate(false)}
            onSubmit={createBattle}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// ── 동네 점수 배너 ─────────────────────────────────────────────────────────────
function NeighborhoodScoreBanner({ myNeighborhood }: { myNeighborhood: string }) {
  const { data: scores = {} } = useQuery({
    queryKey: ["territory-scores"],
    queryFn: battleService.getNeighborhoodScores,
    refetchInterval: 60_000,
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const myScore = scores[myNeighborhood] ?? 0;
  const maxScore = Math.max(...Object.values(scores), 1);

  return (
    <motion.div
      className="mx-4 mt-4 bg-neutral-900 border border-white/5 rounded-2xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-bold text-sm">🏆 동네 순위</p>
        <div className="bg-brand/20 border border-brand/40 px-2 py-0.5 rounded-full">
          <span className="text-brand text-xs font-bold">{myNeighborhood} {myScore}점</span>
        </div>
      </div>
      <div className="space-y-2">
        {sorted.map(([nh, score], i) => (
          <div key={nh} className="flex items-center gap-2">
            <span className="text-xs w-4 text-white/40 font-bold">{i + 1}</span>
            <span className={`text-xs font-bold flex-shrink-0 ${nh === myNeighborhood ? "text-brand" : "text-white/70"}`}>
              {nh}
            </span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: nh === myNeighborhood ? "#FF8200" : "#6B7280" }}
                initial={{ width: 0 }}
                animate={{ width: `${(score / maxScore) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            </div>
            <span className="text-xs text-white/40 w-8 text-right">{score}</span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-white/30 text-xs text-center py-2">아직 기록이 없어요</p>
        )}
      </div>
    </motion.div>
  );
}

// ── 배틀 카드 ──────────────────────────────────────────────────────────────────
function BattleCard({
  battle, myNeighborhood, index, onClick,
}: {
  battle: BattleRoom;
  myNeighborhood: string;
  index: number;
  onClick: () => void;
}) {
  const sport = battle.extra?.sport ?? "기타";
  const neighborhood = battle.extra?.neighborhood ?? "알 수 없음";
  const totalCount = battle.extra?.totalCount ?? 0;
  const deadline = battle.extra?.deadline ? new Date(battle.extra.deadline) : null;
  const isMyNeighborhood = neighborhood === myNeighborhood;
  const color = sportColor(sport);
  const daysLeft = deadline
    ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400_000))
    : null;

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`bg-neutral-900 border rounded-2xl p-4 ${
        isMyNeighborhood ? "border-brand/40" : "border-white/5"
      }`}>
        <div className="flex items-start gap-3">
          {/* 종목 아이콘 */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: `${color}22`, border: `1.5px solid ${color}44` }}
          >
            {sportEmoji(sport)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-sm">{sport} 배틀</span>
              {isMyNeighborhood && (
                <span className="text-xs bg-brand/20 text-brand border border-brand/40 px-1.5 py-0.5 rounded-full font-bold">
                  내 동네
                </span>
              )}
            </div>
            <p className="text-white/50 text-xs mt-0.5">
              {neighborhood} · {battle.user?.name ?? "???"} 개설
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-xs" style={{ color }}>💪</span>
                <span className="text-white text-xs font-bold">{totalCount}회 인증</span>
              </div>
              {daysLeft !== null && (
                <div className="flex items-center gap-1">
                  <span className="text-white/30 text-xs">·</span>
                  <span className={`text-xs font-semibold ${daysLeft <= 1 ? "text-red-400" : "text-white/40"}`}>
                    {daysLeft === 0 ? "오늘 마감" : `${daysLeft}일 남음`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" className="text-white/20 shrink-0 mt-1">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}

// ── 방 만들기 시트 ──────────────────────────────────────────────────────────────
function CreateBattleSheet({
  sport, setSport, deadlineDays, setDeadlineDays,
  isPending, myNeighborhood, onClose, onSubmit,
}: {
  sport: string;
  setSport: (s: string) => void;
  deadlineDays: number;
  setDeadlineDays: (d: number) => void;
  isPending: boolean;
  myNeighborhood: string;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 rounded-t-3xl px-5 py-6 border-t border-white/5"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <h2 className="text-white font-black text-lg mb-1">배틀 방 열기</h2>
        <p className="text-white/40 text-sm mb-5">{myNeighborhood}을 대표해 싸워요!</p>

        {/* 종목 선택 */}
        <p className="text-white/60 text-xs font-bold mb-2 uppercase tracking-wider">종목 선택</p>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {SPORT_LIST.map((s) => (
            <button
              key={s.key}
              onClick={() => setSport(s.key)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
                sport === s.key
                  ? "border-brand bg-brand/10 text-white"
                  : "border-white/10 text-white/40"
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[10px] font-bold">{s.key}</span>
            </button>
          ))}
        </div>

        {/* 마감 기간 */}
        <p className="text-white/60 text-xs font-bold mb-2 uppercase tracking-wider">기간</p>
        <div className="flex gap-2 mb-6">
          {[1, 3, 5, 7].map((d) => (
            <button
              key={d}
              onClick={() => setDeadlineDays(d)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                deadlineDays === d ? "bg-brand text-white" : "bg-white/5 text-white/40"
              }`}
            >
              {d}일
            </button>
          ))}
        </div>

        <HapticButton
          haptic="success"
          onClick={onSubmit}
          disabled={isPending}
          className="w-full py-4 rounded-2xl bg-brand text-white font-black text-base"
        >
          {isPending ? "생성 중..." : `${sport} 배틀 시작! ⚔️`}
        </HapticButton>
      </motion.div>
    </>
  );
}
