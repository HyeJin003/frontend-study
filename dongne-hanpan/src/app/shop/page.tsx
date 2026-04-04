"use client";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { shopService } from "@/services/shopService";
import { useAuthStore, selectUser, selectIsAdmin } from "@/store/useAuthStore";
import HapticButton from "@/components/ui/HapticButton";
import { useAvatarStore } from "@/store/useAvatarStore";
import type { Product } from "@/types";
import type { AvatarLayerKey } from "@/types/avatar";
import type { AvatarCustom } from "@/store/useAvatarStore";

const BALANCE_KEY = ["balance"] as const;
const PRODUCTS_KEY = ["products"] as const;

// 이미지 baseURL (강사님 서버 static 경로)
const IMG_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function ShopPage() {
  const qc = useQueryClient();
  const user = useAuthStore(selectUser);
  const isAdmin = useAuthStore(selectIsAdmin);
  const [boughtId, setBoughtId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const equipItem = useAvatarStore((s) => s.equipItem);
  const setCustom = useAvatarStore((s) => s.setCustom);

  // ── 상품 목록 조회 ──────────────────────────────────────────────
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: shopService.getProducts,
  });

  // ── 내 포인트 조회 ──────────────────────────────────────────────
  const { data: balance = 0 } = useQuery({
    queryKey: BALANCE_KEY,
    queryFn: () => shopService.getMyBalance(user?._id),
    enabled: !!user?._id,
  });

  // ── 구매 뮤테이션 (Optimistic Update) ───────────────────────────
  const { mutate: buy, isPending } = useMutation({
    mutationFn: (product: Product) => shopService.buyProduct(product._id),

    // 1️⃣ 뮤테이션 실행 직전 — 즉시 잔액 차감
    onMutate: async (product: Product) => {
      setErrorMsg(null);
      // 진행 중인 refetch가 낙관적 업데이트를 덮어쓰지 못하게 취소
      await qc.cancelQueries({ queryKey: BALANCE_KEY });

      const prevBalance = qc.getQueryData<number>(BALANCE_KEY) ?? 0;
      // 캐시를 즉시 업데이트 → UI가 바로 반영
      qc.setQueryData<number>(BALANCE_KEY, (old = 0) => old - product.price);

      return { prevBalance }; // rollback을 위한 context
    },

    // 2️⃣ 성공 — 아바타 스토어에 즉시 착용
    onSuccess: (_, product) => {
      setBoughtId(product._id);
      setTimeout(() => setBoughtId(null), 2500);

      // DiceBear extra 값이 있으면 커스텀 스타일에 즉시 반영
      const patch: Partial<AvatarCustom> = {};
      if (product.extra?.dicebearTop)       patch.top = product.extra.dicebearTop as string;
      if (product.extra?.dicebearAccessory)  patch.accessories = product.extra.dicebearAccessory as string;
      if (product.extra?.dicebearClothing)   patch.clothing = product.extra.dicebearClothing as string;
      if (product.extra?.dicebearColor)      patch.clothingColor = product.extra.dicebearColor as string;
      if (Object.keys(patch).length > 0) setCustom(patch);

      // 이미지 레이어 착용 (서버 이미지 상품용)
      const layerKey: AvatarLayerKey = (product.extra?.layerKey as AvatarLayerKey) ?? "top";
      const imagePath = product.mainImages?.[0]?.path ?? "";
      if (imagePath) {
        equipItem({ productId: product._id, layerKey, imagePath: `${IMG_BASE}/${imagePath}`, name: product.name });
      }
    },

    // 3️⃣ 실패 — 이전 잔액으로 롤백
    onError: (err, _product, context) => {
      if (context?.prevBalance !== undefined) {
        qc.setQueryData(BALANCE_KEY, context.prevBalance);
      }
      const msg = err instanceof Error ? err.message : "구매에 실패했습니다.";
      setErrorMsg(msg);
    },

    // 4️⃣ 완료(성공/실패 모두) — 서버 원본으로 동기화
    onSettled: () => {
      qc.invalidateQueries({ queryKey: BALANCE_KEY });
    },
  });

  const handleBuy = (product: Product) => {
    // 관리자는 포인트 체크 없이 무료 착용
    if (!isAdmin && balance < product.price) {
      setErrorMsg("포인트가 부족합니다.");
      return;
    }
    buy(product);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-10">
      {/* ── 헤더 ────────────────────────────────────────────────── */}
      <motion.div
        className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-black text-xl">👗 옷가게</h1>

        {/* 포인트 — 낙관적으로 즉시 줄어드는 숫자 */}
        <motion.div
          key={balance}
          className="flex items-center gap-1.5 bg-brand/15 border border-brand/30 px-3 py-1.5 rounded-full"
          initial={{ scale: 1.15, color: "#FF8200" }}
          animate={{ scale: 1, color: "#ffffff" }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-brand font-black text-sm">P</span>
          <span className="font-bold text-sm tabular-nums">
            {balance.toLocaleString()}
          </span>
        </motion.div>
      </motion.div>

      {/* ── 에러 토스트 ─────────────────────────────────────────── */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            key="err"
            className="mx-4 mt-3 bg-red-900/80 border border-red-500/30 rounded-xl px-4 py-3 flex justify-between items-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-red-200 text-sm">{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 text-xs ml-4"
            >
              닫기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 상품 그리드 ─────────────────────────────────────────── */}
      <section className="px-4 pt-5">
        {productsLoading ? (
          <ProductSkeleton />
        ) : products.length === 0 ? (
          <p className="text-center text-white/30 mt-20 text-sm">
            상품이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                balance={balance}
                isAdmin={isAdmin}
                isBought={boughtId === product._id}
                isBuying={isPending}
                onBuy={handleBuy}
                index={i}
                imgBase={IMG_BASE}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ─── 상품 카드 ────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  balance: number;
  isAdmin: boolean;
  isBought: boolean;
  isBuying: boolean;
  onBuy: (p: Product) => void;
  index: number;
  imgBase: string;
}

function ProductCard({
  product,
  balance,
  isAdmin,
  isBought,
  isBuying,
  onBuy,
  index,
  imgBase,
}: ProductCardProps) {
  const canAfford = isAdmin || balance >= product.price;
  const imgSrc = product.mainImages?.[0]
    ? `${imgBase}/${product.mainImages[0].path}`
    : null;

  // 카테고리 뱃지 색상
  const layerKey = product.extra?.layerKey as string | undefined;
  const categoryColor =
    layerKey === "accessories" ? "#A78BFA" :
    layerKey === "clothing"    ? "#60A5FA" :
    "#FF8200";
  const categoryLabel =
    layerKey === "accessories" ? "액세서리" :
    layerKey === "clothing"    ? "의상" :
    "헤어";

  // 이모지 미리보기 (이미지 없을 때)
  const previewEmoji =
    layerKey === "accessories" ? "🕶" :
    layerKey === "clothing"    ? "👕" :
    product.extra?.dicebearTop === "hat" ? "🎩" :
    product.extra?.dicebearTop?.toString().includes("winter") ? "🧢" :
    "💇";

  return (
    <motion.div
      className="relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 60% 30%, ${categoryColor}18, #1a1a1a 70%)` }}
      >
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">{previewEmoji}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${categoryColor}25`, color: categoryColor }}
            >
              {categoryLabel}
            </span>
          </div>
        )}

        {/* 착용 완료 오버레이 */}
        <AnimatePresence>
          {isBought && (
            <motion.div
              className="absolute inset-0 bg-brand/80 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-white text-4xl font-black"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                ✓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 정보 + 버튼 */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2">
          {product.name}
        </p>
        <p className="text-brand font-black text-base tabular-nums mt-auto">
          {product.price.toLocaleString()} P
        </p>

        <HapticButton
          haptic={canAfford ? "medium" : "error"}
          disabled={!canAfford || isBuying}
          onClick={() => onBuy(product)}
          className={`w-full py-2 rounded-xl text-sm font-bold transition-colors ${
            canAfford
              ? "bg-brand text-white shadow-lg shadow-brand/30"
              : "bg-neutral-700 text-white/30 cursor-not-allowed"
          }`}
        >
          {isBuying ? "착용 중..." : isAdmin ? "👑 무료 착용" : canAfford ? "구매 · 착용" : "포인트 부족"}
        </HapticButton>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-neutral-900 rounded-2xl overflow-hidden">
          <div className="aspect-square bg-neutral-800 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-neutral-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-700 rounded animate-pulse w-1/2" />
            <div className="h-8 bg-neutral-700 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
