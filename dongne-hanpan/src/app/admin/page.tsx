"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore, selectIsAdmin, selectUser } from "@/store/useAuthStore";
import { useAvatarStore } from "@/store/useAvatarStore";
import { shopService } from "@/services/shopService";
import { gameService } from "@/services/gameService";
import { battleService } from "@/services/battleService";
import { sportEmoji } from "@/services/battleService";
import type { Product, Post } from "@/types";
import type { AvatarLayerKey } from "@/types/avatar";

const IMG_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type Tab = "avatar" | "battles" | "games";

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAuthStore(selectIsAdmin);
  const user = useAuthStore(selectUser);
  const [tab, setTab] = useState<Tab>("avatar");

  useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-10">
      {/* 헤더 */}
      <motion.header
        className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur-md border-b border-brand/20 px-4 py-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-white/50 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg">관리자 패널</h1>
                <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full font-bold">ADMIN</span>
              </div>
              <p className="text-white/40 text-xs">{user?.name} · 모든 권한 보유</p>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mt-3 bg-neutral-900 rounded-xl p-1">
          {([
            { key: "avatar", label: "👑 아바타" },
            { key: "battles", label: "⚔️ 배틀" },
            { key: "games", label: "🎮 게임" },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === t.key ? "bg-brand text-white shadow" : "text-white/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {tab === "avatar" && <AvatarTab key="avatar" />}
        {tab === "battles" && <BattlesTab key="battles" />}
        {tab === "games" && <GamesTab key="games" />}
      </AnimatePresence>
    </main>
  );
}

// ── 아바타 자유 착용 탭 ────────────────────────────────────────────────────────
function AvatarTab() {
  const equipItem = useAvatarStore((s) => s.equipItem);
  const equipped = useAvatarStore((s) => s.currentEquipped);
  const resetEquipped = useAvatarStore((s) => s.resetEquipped);
  const [equippedId, setEquippedId] = useState<number | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: shopService.getProducts,
  });

  const handleEquip = (product: Product) => {
    const layerKey: AvatarLayerKey = (product.extra?.layerKey as AvatarLayerKey) ?? "top";
    const imagePath = product.mainImages?.[0]?.path ?? "";
    equipItem({
      productId: product._id,
      layerKey,
      imagePath: imagePath ? `${IMG_BASE}/${imagePath}` : "",
      name: product.name,
    });
    setEquippedId(product._id);
    setTimeout(() => setEquippedId(null), 1500);
  };

  const isWearing = (id: number) =>
    Object.values(equipped ?? {}).some((e) => e?.productId === id);

  return (
    <motion.div
      className="px-4 pt-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-bold">무제한 아바타 착용</p>
          <p className="text-white/40 text-xs">포인트 없이 모든 아이템 즉시 착용</p>
        </div>
        <button
          onClick={resetEquipped}
          className="text-xs text-red-400 font-bold border border-red-400/30 px-3 py-1.5 rounded-xl"
        >
          전부 벗기
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-white/30 mt-20 text-sm">등록된 상품이 없어요</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, i) => {
            const imgSrc = product.mainImages?.[0]
              ? `${IMG_BASE}/${product.mainImages[0].path}`
              : null;
            const wearing = isWearing(product._id);
            const justEquipped = equippedId === product._id;

            return (
              <motion.button
                key={product._id}
                onClick={() => handleEquip(product)}
                className={`relative bg-neutral-900 rounded-2xl overflow-hidden border flex flex-col text-left ${
                  wearing ? "border-brand/60" : "border-white/5"
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="relative aspect-square bg-neutral-800">
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">👕</div>
                  )}
                  {wearing && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-black">✓</span>
                    </div>
                  )}
                  <AnimatePresence>
                    {justEquipped && (
                      <motion.div
                        className="absolute inset-0 bg-brand/70 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-white text-3xl font-black">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-3">
                  <p className="text-white text-xs font-semibold line-clamp-1">{product.name}</p>
                  <p className="text-brand text-xs font-black mt-0.5">{product.price.toLocaleString()} P</p>
                  <div className="mt-2 w-full py-1.5 rounded-lg bg-brand text-white text-xs font-bold text-center">
                    {wearing ? "착용 중" : "무료 착용"}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ── 배틀 관리 탭 ───────────────────────────────────────────────────────────────
function BattlesTab() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: battles = [], isLoading } = useQuery({
    queryKey: ["battles"],
    queryFn: battleService.getBattles,
  });

  const { mutate: deleteBattle } = useMutation({
    mutationFn: (id: number) => battleService.deleteBattle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["battles"] });
      setConfirmId(null);
    },
  });

  return (
    <motion.div
      className="px-4 pt-4 space-y-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-2">
        <p className="text-white font-bold">배틀방 관리</p>
        <p className="text-white/40 text-xs">전체 {battles.length}개 · 삭제 시 복구 불가</p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && battles.length === 0 && (
        <p className="text-center text-white/30 text-sm mt-10">배틀방이 없어요</p>
      )}

      {battles.map((battle, i) => (
        <motion.div
          key={battle._id}
          className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <span className="text-2xl shrink-0">{sportEmoji(battle.extra?.sport ?? "")}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{battle.title}</p>
            <p className="text-white/40 text-xs">{battle.extra?.neighborhood} · {battle.extra?.totalCount ?? 0}회 인증</p>
          </div>
          {confirmId === battle._id ? (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => deleteBattle(battle._id)}
                className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg"
              >
                확인
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="text-xs bg-neutral-700 text-white/60 font-bold px-3 py-1.5 rounded-lg"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmId(battle._id)}
              className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-xl shrink-0"
            >
              삭제
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── 게임 관리 탭 ───────────────────────────────────────────────────────────────
function GamesTab() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: gameService.getGames,
  });

  const { mutate: deleteGame } = useMutation({
    mutationFn: (id: number) => gameService.deleteGame(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
      setConfirmId(null);
    },
  });

  return (
    <motion.div
      className="px-4 pt-4 space-y-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-2">
        <p className="text-white font-bold">게임 관리</p>
        <p className="text-white/40 text-xs">전체 {games.length}개</p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && games.length === 0 && (
        <p className="text-center text-white/30 text-sm mt-10">게임이 없어요</p>
      )}

      {games.map((game: Post, i: number) => {
        const extra = game.extra as Record<string, unknown> | undefined;
        return (
          <motion.div
            key={game._id}
            className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="text-2xl shrink-0">{sportEmoji((extra?.sport as string) ?? "")}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{game.title}</p>
              <p className="text-white/40 text-xs">
                {(extra?.location as string) ?? ""} · {game.user?.name}
              </p>
            </div>
            {confirmId === game._id ? (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => deleteGame(game._id)}
                  className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  확인
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="text-xs bg-neutral-700 text-white/60 font-bold px-3 py-1.5 rounded-lg"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(game._id)}
                className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-xl shrink-0"
              >
                삭제
              </button>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
