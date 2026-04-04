"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMap } from "@/hooks/useMap";
import { useFashionTier } from "@/hooks/useFashionTier";
import { TIER_VISUAL } from "@/components/map/tierConfig";
import { gameService } from "@/services/gameService";
import { battleService } from "@/services/battleService";
import { useAuthStore, selectUser, selectIsLoggedIn, selectNeighborhood, selectIsAdmin } from "@/store/useAuthStore";
import { useAvatarStore, selectCustom } from "@/store/useAvatarStore";
import DiceBearAvatar from "@/components/avatar/DiceBearAvatar";
import NeighborhoodSheet from "@/components/neighborhood/NeighborhoodSheet";
import GameDetailSheet from "@/components/game/GameDetailSheet";
import CreateGameSheet, { type CreateGameForm } from "@/components/game/CreateGameSheet";
import HapticButton from "@/components/ui/HapticButton";
import SuccessCelebration from "@/components/ui/SuccessCelebration";
import type { Post } from "@/types";

const KakaoMapView = dynamic(() => import("@/components/map/KakaoMapView"), { ssr: false });

const GAMES_KEY = ["games"] as const;

export default function HomePage() {
  const router = useRouter();
  const qc = useQueryClient();

  // ── 인증 상태
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const user = useAuthStore(selectUser);
  const myNeighborhood = useAuthStore(selectNeighborhood) ?? "내 동네";
  const isAdmin = useAuthStore(selectIsAdmin);
  const gender = useAvatarStore((s) => s.gender);
  const custom = useAvatarStore(selectCustom);
  const [showGameList, setShowGameList] = useState(false);

  // ── 비로그인 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const { position, status, refresh, accuracy } = useMap();
  const { tier, postCount, isLoading: isTierLoading } = useFashionTier(user?._id ?? null);

  const [selectedGame, setSelectedGame] = useState<Post | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNeighborhood, setShowNeighborhood] = useState(false);

  const isLocating = status === "idle" || status === "loading";
  const mapCenter = position ?? { lat: 37.5665, lng: 126.978 };
  const tierVisual = TIER_VISUAL[tier];

  // ── 주변 게임 목록
  const { data: games = [] } = useQuery({
    queryKey: GAMES_KEY,
    queryFn: gameService.getGames,
    refetchInterval: 30_000,
    enabled: isLoggedIn,
  });

  // ── 동네 점수 (territory badge)
  const { data: nhScores = {} } = useQuery({
    queryKey: ["territory-scores"],
    queryFn: battleService.getNeighborhoodScores,
    refetchInterval: 60_000,
    enabled: isLoggedIn,
  });
  const allNeighborhoods = Object.keys(nhScores);
  const myScore = nhScores[myNeighborhood] ?? 0;

  // ── 게임 생성
  const { mutate: createGame, isPending: isCreating } = useMutation({
    mutationFn: (form: CreateGameForm) =>
      gameService.createGame({
        title: form.title,
        content: form.content,
        sport: form.sport,
        location: form.location,
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        maxPlayers: form.maxPlayers,
        lat: form.lat || mapCenter.lat,
        lng: form.lng || mapCenter.lng,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GAMES_KEY });
      setShowCreate(false);
      setShowSuccess(true);
    },
    onError: (err) => {
      console.error("게임 생성 실패:", err);
      setShowCreate(false);
      alert("게임 생성에 실패했어요. 다시 시도해주세요.");
    },
  });

  // ── 게임 참가
  const { mutate: joinGame, isPending: isJoining } = useMutation({
    mutationFn: async (game: Post) => {
      const extra = game.extra as Record<string, unknown>;
      return gameService.createGame({
        title: `${game.title} 참가`,
        content: "",
        sport: (extra.sport as string) ?? "기타",
        location: (extra.location as string) ?? "",
        date: (extra.date as string) ?? "",
        maxPlayers: (extra.maxPlayers as number) ?? 0,
        lat: (extra.lat as number) ?? 0,
        lng: (extra.lng as number) ?? 0,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GAMES_KEY });
      setSelectedGame(null);
    },
  });

  // 비로그인 상태면 아무것도 렌더링하지 않음
  if (!isLoggedIn) return null;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-neutral-950">
      {/* ── 풀스크린 지도 + 게임 마커 ────────────────────────── */}
      <KakaoMapView
        position={mapCenter}
        isLocating={isLocating}
        tier={tier}
        gender={gender}
        custom={custom}
        username={user?.name ?? "나"}
        games={games}
        selectedGameId={selectedGame?._id ?? null}
        onGameMarkerClick={setSelectedGame}
        myNeighborhood={myNeighborhood}
        allNeighborhoods={allNeighborhoods}
      />

      {/* ── 상단 헤더 ─────────────────────────────────────────── */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-20 px-4 pt-safe"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/40">
              <span className="text-white font-black text-sm">동</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight drop-shadow">
              동네한판
            </span>
          </div>

          <div className="flex items-center gap-2">
            {games.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowGameList(true)}
                className="flex items-center gap-1.5 bg-brand/20 border border-brand/40 px-2.5 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                <span className="text-brand text-xs">⚡</span>
                <span className="text-white text-xs font-bold">{games.length}개 게임</span>
              </motion.button>
            )}

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm text-xs font-semibold shadow ${
              status === "success"
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : status === "error"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-white/10 text-white/60 border border-white/10"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                status === "success" ? "bg-green-400 animate-pulse"
                  : status === "error" ? "bg-red-400"
                  : "bg-white/40 animate-pulse"
              }`} />
              {status === "success" ? (accuracy ? `±${Math.round(accuracy)}m` : "위치 확인")
                : status === "error" ? "위치 오류"
                : "위치 탐색 중"}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── 티어 토스트 ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!isTierLoading && (
          <motion.div
            key={tier}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-xl text-sm font-bold whitespace-nowrap"
              style={{ background: tierVisual.badgeBg, color: tierVisual.badgeText, border: `1.5px solid ${tierVisual.borderColor}55` }}
            >
              <span className="text-lg">{tierVisual.emoji}</span>
              <span>{tierVisual.label}</span>
              <span className="opacity-50 font-normal text-xs">게시글 {postCount}개</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 위치 권한 거부 안내 ───────────────────────────────── */}
      {status === "error" && (
        <motion.div
          className="absolute top-20 left-4 right-4 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-neutral-900/95 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 flex gap-3 items-start shadow-xl">
            <span className="text-2xl shrink-0">📍</span>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">위치 접근을 허용해주세요</p>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">
                주소창 왼쪽 🔒 자물쇠 →{" "}
                <strong className="text-white/70">위치 → 허용</strong> 후 새로고침
              </p>
            </div>
            <button onClick={refresh} className="text-brand text-xs font-bold shrink-0 mt-0.5">재시도</button>
          </div>
        </motion.div>
      )}

      {/* ── 하단 네비게이션 바 ────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.35 }}
      >
        {/* 동네·점수 스코어보드 */}
        <div className="flex items-center justify-center mb-2 px-4">
          <button
            onClick={() => setShowNeighborhood(true)}
            className="flex items-center gap-3 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-2 shadow-xl active:scale-95 transition-transform"
          >
            {/* 동네 이름 — 탭하면 변경 */}
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏘️</span>
              <span className="text-white font-bold text-sm">{myNeighborhood}</span>
              <span className="text-white/30 text-xs">▾</span>
            </div>
            {/* 구분선 */}
            <div className="w-px h-4 bg-white/15" />
            {/* 점수 */}
            <div className="flex items-center gap-1">
              <span className="text-brand text-xs font-black">{myScore > 0 ? `${myScore}점` : "0점"}</span>
            </div>
            {isAdmin && (
              <>
                <div className="w-px h-4 bg-white/15" />
                <span className="text-yellow-400 text-xs font-black">👑 ADMIN</span>
              </>
            )}
          </button>
        </div>

        {/* 메인 탭바 — 유리판 스타일 */}
        <div className="mx-3">
          <div
            className="flex items-center bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-3xl px-2 py-2 shadow-2xl"
            style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.5), 0 2px 20px rgba(0,0,0,0.4)" }}
          >
            {/* 캐릭터 탭 — DiceBear 얼굴 원형 (포켓몬GO 스타일) */}
            <motion.button
              onClick={() => router.push("/avatar")}
              className="flex-1 flex flex-col items-center gap-1 py-1 rounded-2xl active:bg-white/5 transition-colors"
              whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
            >
              <motion.div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: 48, height: 48,
                  border: `2.5px solid ${tierVisual.borderColor}`,
                  boxShadow: `0 0 0 2px rgba(0,0,0,0.5), 0 2px 12px ${tierVisual.borderColor}55`,
                  background: tierVisual.avatarGradient,
                }}
                animate={
                  tier === "FASHIONISTA"
                    ? { boxShadow: [`0 0 0 2px rgba(0,0,0,0.5), 0 0 8px ${tierVisual.borderColor}`, `0 0 0 2px rgba(0,0,0,0.5), 0 0 20px ${tierVisual.borderColor}`, `0 0 0 2px rgba(0,0,0,0.5), 0 0 8px ${tierVisual.borderColor}`] }
                    : tier === "TERRORIST" ? { rotate: [-3, 3, -3] } : {}
                }
                transition={
                  tier === "FASHIONISTA" ? { duration: 2, repeat: Infinity }
                    : tier === "TERRORIST" ? { duration: 0.9, repeat: Infinity } : {}
                }
              >
                <DiceBearAvatar custom={custom} gender={gender} size={48} />
              </motion.div>
              <span className="text-white/40 text-[9px] font-semibold">{user?.name ?? "나"}</span>
            </motion.button>

            {/* 중앙 FAB — 운동경기 시작 버튼 */}
            <motion.div
              className="flex flex-col items-center gap-1 -mt-6"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 280, damping: 22 }}
            >
              <HapticButton
                haptic="medium"
                onClick={() => setShowCreate(true)}
                className="relative w-[68px] h-[68px] rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #FF9B26, #FF8200, #E06000)",
                  boxShadow: "0 0 0 3px rgba(255,130,0,0.3), 0 6px 28px rgba(255,130,0,0.5), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {/* 배경 패턴 — 운동장 라인 느낌 */}
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
                  <div className="absolute inset-3 rounded-full border border-white" />
                </div>
                <motion.span
                  className="relative text-2xl z-10"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🏃
                </motion.span>
              </HapticButton>
              <span className="text-white/50 text-[9px] font-bold mt-0.5">경기 열기</span>
            </motion.div>

            {/* 배틀 / 관리자 탭 */}
            <motion.button
              onClick={() => router.push(isAdmin ? "/admin" : "/battle")}
              className="flex-1 flex flex-col items-center gap-1 py-1 rounded-2xl active:bg-white/5 transition-colors"
              whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={isAdmin
                  ? { background: "linear-gradient(135deg, #F59E0B22, #D9770622)", border: "2px solid #F59E0B60" }
                  : { background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)" }
                }
              >
                <span className="text-xl">{isAdmin ? "👑" : "⚔️"}</span>
              </div>
              <span className="text-white/40 text-[9px] font-semibold">{isAdmin ? "관리자" : "배틀"}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── 동네 선택 시트 ───────────────────────────────────────── */}
      <NeighborhoodSheet
        open={showNeighborhood}
        onClose={() => setShowNeighborhood(false)}
      />

      {/* ── 게임 상세 바텀시트 ─────────────────────────────────── */}
      <GameDetailSheet
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onJoin={joinGame}
        isJoining={isJoining}
      />

      {/* ── 게임 생성 바텀시트 ─────────────────────────────────── */}
      <CreateGameSheet
        show={showCreate}
        currentPosition={mapCenter}
        onClose={() => setShowCreate(false)}
        onSubmit={createGame}
        isPending={isCreating}
      />

      {/* ── 주변 게임 목록 패널 ───────────────────────────────── */}
      <NearbyGamesPanel
        games={games}
        show={showGameList}
        onClose={() => setShowGameList(false)}
        onSelect={(game) => { setSelectedGame(game); setShowGameList(false); }}
      />

      {/* ── 성공 축하 ─────────────────────────────────────────── */}
      <SuccessCelebration
        show={showSuccess}
        title="게임 개설! 🎉"
        subtitle="지도에 핀이 꽂혔어요!"
        onDone={() => setShowSuccess(false)}
      />
    </main>
  );
}

// ── 주변 게임 목록 패널 ────────────────────────────────────────────────────────
const SPORT_EMOJI: Record<string, string> = {
  축구: "⚽", 농구: "🏀", 배드민턴: "🏸", 테니스: "🎾",
  러닝: "🏃", 헬스: "💪", 기타: "🏅",
};
const SPORT_COLOR: Record<string, string> = {
  축구: "#22C55E", 농구: "#F97316", 배드민턴: "#3B82F6",
  테니스: "#EAB308", 러닝: "#EC4899", 헬스: "#8B5CF6", 기타: "#FF8200",
};

function NearbyGamesPanel({
  games, show, onClose, onSelect,
}: {
  games: Post[];
  show: boolean;
  onClose: () => void;
  onSelect: (game: Post) => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-black/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 rounded-t-3xl border-t border-white/5 max-h-[70vh] flex flex-col"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="px-4 pb-3 shrink-0">
              <h2 className="text-white font-black text-lg">⚡ 주변 게임 {games.length}개</h2>
              <p className="text-white/40 text-xs">탭해서 상세 보기</p>
            </div>
            <div className="overflow-y-auto px-4 pb-8 space-y-2">
              {games.map((game, i) => {
                const extra = game.extra as Record<string, unknown> | undefined;
                const sport = (extra?.sport as string) ?? "기타";
                const location = (extra?.location as string) ?? "";
                const maxP = (extra?.maxPlayers as number) ?? 0;
                const curP = (extra?.currentPlayers as number) ?? 0;
                const isFull = maxP > 0 && curP >= maxP;
                const color = SPORT_COLOR[sport] ?? "#FF8200";
                return (
                  <motion.button
                    key={game._id}
                    onClick={() => onSelect(game)}
                    className="w-full text-left bg-neutral-800 border border-white/5 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${color}22`, border: `1.5px solid ${color}44` }}>
                      {SPORT_EMOJI[sport] ?? "🏅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{game.title}</p>
                      <p className="text-white/40 text-xs mt-0.5 truncate">{location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-black" style={{ color: isFull ? "#EF4444" : color }}>
                        {isFull ? "마감" : `${curP}/${maxP}`}
                      </p>
                      <p className="text-white/30 text-[10px]">명</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
