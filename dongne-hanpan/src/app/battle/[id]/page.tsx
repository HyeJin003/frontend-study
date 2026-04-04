"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { battleService, sportEmoji } from "@/services/battleService";
import { useAuthStore, selectNeighborhood } from "@/store/useAuthStore";
import HapticButton from "@/components/ui/HapticButton";
import SuccessCelebration from "@/components/ui/SuccessCelebration";

const SPORT_BG: Record<string, string> = {
  줄넘기: "#FF8200",
  팔굽혀펴기: "#EF4444",
  스쿼트: "#8B5CF6",
  달리기: "#10B981",
  농구: "#F59E0B",
  축구: "#3B82F6",
  배드민턴: "#EC4899",
};

export default function BattleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const myNeighborhood = useAuthStore(selectNeighborhood) ?? "내 동네";

  const battleId = Number(params.id);
  const battleKey = ["battle", battleId] as const;

  const [showCertify, setShowCertify] = useState(false);
  const [count, setCount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [certifyError, setCertifyError] = useState<string | null>(null);

  const { data: battle, isLoading } = useQuery({
    queryKey: battleKey,
    queryFn: () => battleService.getBattle(battleId),
  });

  const { mutate: certify, isPending: isCertifying } = useMutation({
    mutationFn: (n: number) => battleService.certify(battleId, n, battle!.extra),
    onSuccess: (_, n) => {
      qc.invalidateQueries({ queryKey: battleKey });
      qc.invalidateQueries({ queryKey: ["battles"] });
      qc.invalidateQueries({ queryKey: ["territory-scores"] });
      setLastCount(n);
      setShowCertify(false);
      setCount("");
      setShowSuccess(true);
      setCertifyError(null);
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "인증에 실패했습니다.";
      setCertifyError(msg);
    },
  });

  const handleCertify = () => {
    const n = parseInt(count, 10);
    if (!n || n <= 0) return;
    certify(n);
  };

  if (isLoading || !battle) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white/40 text-sm">로딩 중...</div>
      </main>
    );
  }

  const sport = battle.extra?.sport ?? "기타";
  const neighborhood = battle.extra?.neighborhood ?? "";
  const totalCount = battle.extra?.totalCount ?? 0;
  const deadline = battle.extra?.deadline ? new Date(battle.extra.deadline) : null;
  const daysLeft = deadline
    ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400_000))
    : null;
  const accentColor = SPORT_BG[sport] ?? "#FF8200";
  const replies = battle.replies ?? [];
  const isMyNeighborhood = neighborhood === myNeighborhood;

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-36">
      {/* 에러 토스트 */}
      <AnimatePresence>
        {certifyError && (
          <motion.div
            className="fixed top-4 left-4 right-4 z-50 bg-red-900/90 border border-red-500/30 rounded-2xl px-4 py-3 flex justify-between items-center shadow-xl"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-red-200 text-sm">{certifyError}</span>
            <button onClick={() => setCertifyError(null)} className="text-red-400 text-xs ml-3">닫기</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 히어로 헤더 */}
      <div
        className="relative px-4 pt-safe pb-8"
        style={{ background: `linear-gradient(180deg, ${accentColor}22 0%, transparent 100%)` }}
      >
        <div className="flex items-center gap-3 pt-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-white/40 text-sm">배틀 상세</span>
        </div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${accentColor}22`, border: `2px solid ${accentColor}44` }}
          >
            {sportEmoji(sport)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-white font-black text-2xl">{sport}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${accentColor}30`, color: accentColor }}>
                {neighborhood}
              </span>
              {isMyNeighborhood && (
                <span className="text-xs bg-brand/20 text-brand border border-brand/40 px-1.5 py-0.5 rounded-full font-bold">
                  내 동네
                </span>
              )}
            </div>
            <p className="text-white/40 text-sm">{battle.title}</p>
          </div>
        </motion.div>

        {/* 스탯 */}
        <motion.div
          className="grid grid-cols-3 gap-3 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard label="총 인증" value={`${totalCount}회`} color={accentColor} />
          <StatCard label="참여자" value={`${replies.length}명`} color="#60A5FA" />
          <StatCard
            label={daysLeft === null ? "기간" : daysLeft === 0 ? "마감됨" : "남은 기간"}
            value={daysLeft === null ? "?" : daysLeft === 0 ? "종료" : `${daysLeft}일`}
            color={daysLeft === 0 ? "#9CA3AF" : daysLeft! <= 1 ? "#F87171" : "#34D399"}
          />
        </motion.div>
      </div>

      {/* 인증 버튼 */}
      <div className="px-4 mb-5 space-y-2">
        {daysLeft === 0 ? (
          <div className="w-full py-4 rounded-2xl text-center text-white/40 text-sm bg-neutral-800/50 border border-white/5">
            🏁 마감된 배틀입니다
          </div>
        ) : (
          <>
            {!isMyNeighborhood && myNeighborhood !== "내 동네" && (
              <p className="text-white/30 text-xs text-center">
                다른 동네 배틀이지만 누구나 참여할 수 있어요!
              </p>
            )}
            <HapticButton
              haptic="success"
              onClick={() => setShowCertify(true)}
              className="w-full py-4 rounded-2xl font-black text-base shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                boxShadow: `0 8px 24px ${accentColor}44`,
                color: "white",
              }}
            >
              💪 운동 횟수 인증하기
            </HapticButton>
          </>
        )}
      </div>

      {/* 인증 피드 */}
      <div className="px-4">
        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">
          인증 피드 ({replies.length})
        </p>

        {replies.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">🏃</p>
            <p className="text-white/40 text-sm">아직 인증이 없어요. 첫 인증을 해보세요!</p>
          </div>
        )}

        <div className="space-y-3">
          {[...replies].reverse().map((reply, i) => {
            const certCount = (reply as unknown as { extra?: Record<string, unknown> }).extra?.count as number | undefined;
            return (
              <motion.div
                key={reply._id}
                className="bg-neutral-900 border border-white/5 rounded-2xl p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                  >
                    {reply.user?.name?.[0] ?? "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">{reply.user?.name ?? "익명"}</span>
                      {certCount && (
                        <span className="font-black text-sm" style={{ color: accentColor }}>
                          {certCount}회
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">{reply.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 인증 입력 시트 */}
      <AnimatePresence>
        {showCertify && (
          <CertifySheet
            sport={sport}
            accentColor={accentColor}
            count={count}
            setCount={setCount}
            isPending={isCertifying}
            onClose={() => setShowCertify(false)}
            onSubmit={handleCertify}
          />
        )}
      </AnimatePresence>

      {/* 성공 축하 */}
      <SuccessCelebration
        show={showSuccess}
        title={`${lastCount}회 인증 완료! 🎉`}
        subtitle="동네 점수가 올라갔어요!"
        onDone={() => setShowSuccess(false)}
      />
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-3 text-center">
      <p className="font-black text-lg" style={{ color }}>{value}</p>
      <p className="text-white/40 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function CertifySheet({
  sport, accentColor, count, setCount, isPending, onClose, onSubmit,
}: {
  sport: string;
  accentColor: string;
  count: string;
  setCount: (v: string) => void;
  isPending: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const n = parseInt(count, 10);
  const valid = !isNaN(n) && n > 0;

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
        <h2 className="text-white font-black text-xl mb-1">
          {sportEmoji(sport)} {sport} 인증
        </h2>
        <p className="text-white/40 text-sm mb-6">오늘 운동한 횟수를 입력해주세요</p>

        <div className="relative mb-3">
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && valid && onSubmit()}
            autoFocus
            className="w-full bg-neutral-800 border border-white/10 rounded-2xl px-5 py-4 text-white text-3xl font-black text-center placeholder-white/20 outline-none"
            style={{ borderColor: valid ? `${accentColor}60` : undefined }}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 text-base font-bold">회</span>
        </div>

        {/* 빠른 선택 버튼 */}
        <div className="flex gap-2 mb-6">
          {[10, 30, 50, 100].map((v) => (
            <button
              key={v}
              onClick={() => setCount(String(v))}
              className="flex-1 py-2 rounded-xl text-sm font-bold bg-white/5 text-white/50 hover:bg-white/10 transition-colors"
            >
              {v}
            </button>
          ))}
        </div>

        <HapticButton
          haptic="success"
          onClick={onSubmit}
          disabled={!valid || isPending}
          className="w-full py-4 rounded-2xl font-black text-base text-white"
          style={valid ? {
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: `0 6px 20px ${accentColor}44`,
          } : { backgroundColor: "#262626", color: "rgba(255,255,255,0.2)" }}
        >
          {isPending ? "인증 중..." : valid ? `${n}회 인증하기 💪` : "횟수를 입력하세요"}
        </HapticButton>
      </motion.div>
    </>
  );
}
