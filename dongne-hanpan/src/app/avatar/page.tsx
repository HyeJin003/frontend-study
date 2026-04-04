"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAvatarStore,
  selectGender, selectTier, selectEquipped, selectCustom,
} from "@/store/useAvatarStore";
import { useAuthStore, selectUser } from "@/store/useAuthStore";
import { useFashionTier } from "@/hooks/useFashionTier";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";
import GenderSelector from "@/components/avatar/GenderSelector";
import EquippedPanel from "@/components/avatar/EquippedPanel";
import HapticButton from "@/components/ui/HapticButton";
import { TIER_VISUAL } from "@/components/map/tierConfig";
import type { AvatarTier } from "@/types/avatar";

const TIER_DISPLAY: Record<AvatarTier, { label: string; desc: string }> = {
  FASHIONISTA: { label: "👑 패셔니스타", desc: "게시글 10개 이상 — 황금 아우라 보유" },
  NORMAL:      { label: "🏃 동네 주민",  desc: "게시글 3~9개 — 성실한 운동러" },
  TERRORIST:   { label: "🤧 패션 테러",  desc: "게시글 3개 미만 — 오늘도 아무거나" },
};

// ── 커스터마이징 옵션 목록 (DiceBear avataaars 실제 enum 값) ─────────────────
const MOUTHS = ["smile", "serious", "tongue", "twinkle", "default", "disbelief", "eating", "grimace", "sad", "screamOpen", "vomit"];
const EYES   = ["happy", "default", "closed", "cry", "eyeRoll", "hearts", "side", "squint", "surprised", "wink", "winkWacky", "xDizzy"];
const EYEBROWS = ["raisedExcitedNatural", "defaultNatural", "flatNatural", "frownNatural", "sadConcernedNatural", "unibrowNatural", "upDownNatural", "raisedExcited", "default", "sadConcerned", "upDown", "angry", "angryNatural"];
const TOPS_MALE   = ["shortFlat", "shortCurly", "shortRound", "shortWaved", "sides", "theCaesar", "theCaesarAndSidePart", "dreads01", "dreads02", "frizzle", "shaggy", "shaggyMullet", "hat", "winterHat1", "winterHat02", "winterHat03", "winterHat04"];
const TOPS_FEMALE = ["straight01", "straight02", "straightAndStrand", "bigHair", "bob", "bun", "curly", "curvy", "dreads", "frida", "fro", "froBand", "longButNotTooLong", "miaWallace", "shavedSides"];
// 헤어 색상 — hex without #
const HAIR_COLORS = ["2c1b18", "a55728", "b58143", "d6b370", "724133", "4a312c", "f59797", "ecdcbf", "c93305", "e8e1e1"];
// 피부 색상 — hex without #
const SKIN_COLORS = ["ffdbb4", "edb98a", "fd9841", "f8d25c", "d08b5b", "ae5d29", "614335"];
const CLOTHES_LIST = ["hoodie", "blazerAndShirt", "blazerAndSweater", "collarAndSweater", "graphicShirt", "shirtCrewNeck", "shirtScoopNeck", "shirtVNeck", "overall"];
// 옷 색상 — hex without #
const CLOTHING_COLORS = ["262e33", "65c9ff", "5199e4", "25557c", "e6e6e6", "929598", "3c4f5c", "b1e2ff", "a7ffc4", "ffafb9", "ffffb1", "ff488e", "ff5c5c", "ffffff"];
const ACCESSORIES_LIST = ["blank", "kurt", "prescription01", "prescription02", "round", "sunglasses", "wayfarers"];
const FACIAL_HAIR_LIST = ["blank", "beardLight", "beardMajestic", "beardMedium", "moustacheFancy", "moustacheMagnum"];

const LABEL: Partial<Record<string, string>> = {
  smile: "😊 미소", serious: "😐 진지", tongue: "😛 혀", twinkle: "😉 윙크", default: "😶 기본",
  disbelief: "🙄 불신", grimace: "😬 찡그림", sad: "😢 슬픔", screamOpen: "😱 비명", eating: "😋 먹방", vomit: "🤢 토함",
  happy: "😁 행복", closed: "😑 눈감기", cry: "😭 울음", eyeRoll: "🙄 눈굴리기",
  hearts: "😍 하트", side: "👀 곁눈질", squint: "🤨 가늘게", surprised: "😮 놀람", wink: "😉 윙크", winkWacky: "🤪 익살",
  xDizzy: "😵‍💫 X눈",
  raisedExcitedNatural: "기본", defaultNatural: "자연스럽게", flatNatural: "평평하게",
  frownNatural: "찡그리기", sadConcernedNatural: "슬픔", unibrowNatural: "일자눈썹", upDownNatural: "위아래",
  raisedExcited: "올리기", upDown: "위아래", angry: "화남", angryNatural: "자연화남", sadConcerned: "슬픔",
  shortFlat: "단발 평평", shortCurly: "단발 곱슬", shortRound: "단발 둥근", shortWaved: "단발 웨이브",
  sides: "옆머리", theCaesar: "시저컷", theCaesarAndSidePart: "시저 가르마",
  dreads01: "드레드1", dreads02: "드레드2", frizzle: "곱슬", shaggy: "샤기", shaggyMullet: "샤기멀렛",
  hat: "모자", winterHat1: "니트모자1", winterHat02: "니트모자2", winterHat03: "니트모자3", winterHat04: "니트모자4",
  straight01: "스트레이트", straight02: "스트레이트2", straightAndStrand: "스트랜드", bigHair: "빅헤어",
  bob: "단발", bun: "번", curly: "곱슬", curvy: "웨이브", dreads: "드레드", frida: "프리다",
  fro: "아프로", froBand: "아프로밴드", longButNotTooLong: "세미롱", miaWallace: "미아왈라스", shavedSides: "언더컷",
  hoodie: "후디", blazerAndShirt: "블레이저+셔츠", blazerAndSweater: "블레이저+스웨터",
  collarAndSweater: "카라+스웨터", graphicShirt: "그래픽티", shirtCrewNeck: "크루넥",
  shirtScoopNeck: "스쿱넥", shirtVNeck: "브이넥", overall: "오버롤",
  blank: "없음", kurt: "커트", prescription01: "안경1", prescription02: "안경2",
  round: "둥근안경", sunglasses: "선글라스", wayfarers: "웨이파러",
  beardLight: "수염(라이트)", beardMajestic: "수염(풍성)", beardMedium: "수염(중간)",
  moustacheFancy: "콧수염(팬시)", moustacheMagnum: "콧수염(매그넘)",
};

type TabId = "face" | "hair" | "clothes" | "extra";

const TABS: { id: TabId; label: string }[] = [
  { id: "face",   label: "😊 얼굴" },
  { id: "hair",   label: "💇 헤어" },
  { id: "clothes",label: "👕 옷"   },
  { id: "extra",  label: "🕶 기타" },
];

function OptionRow({
  label, options, value, onChange, colorMode,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  colorMode?: boolean;
}) {
  return (
    <div>
      <p className="text-white/50 text-xs font-semibold mb-2">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {options.map((opt) => {
          const active = value === opt;
          return colorMode ? (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              title={LABEL[opt] ?? opt}
              className={`shrink-0 rounded-full border-2 transition-all ${active ? "border-brand scale-110" : "border-white/10"}`}
              style={{ width: 28, height: 28, backgroundColor: hexToDisplay(opt) }}
            />
          ) : (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                active ? "bg-brand text-white border-brand" : "bg-white/5 text-white/60 border-white/10"
              }`}
            >
              {LABEL[opt] ?? opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// hex 값 그대로 사용 (DiceBear 색상은 이미 hex)
function hexToDisplay(hex: string) {
  return `#${hex}`;
}

export default function AvatarPage() {
  const router   = useRouter();
  const gender   = useAvatarStore(selectGender);
  const tier     = useAvatarStore(selectTier);
  const equipped = useAvatarStore(selectEquipped);
  const custom   = useAvatarStore(selectCustom);
  const { setGender, setTier, unequipItem, resetEquipped, setCustom, resetCustom } = useAvatarStore();
  const logout = useAuthStore((s) => s.logout);
  const user   = useAuthStore(selectUser);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const [activeTab, setActiveTab] = useState<TabId>("face");

  const { tier: serverTier, postCount } = useFashionTier(user?._id ?? null);
  useEffect(() => {
    if (serverTier !== tier) setTier(serverTier);
  }, [serverTier]); // eslint-disable-line react-hooks/exhaustive-deps

  const visual    = TIER_VISUAL[tier];
  const tierInfo  = TIER_DISPLAY[tier];
  const equippedCount = Object.keys(equipped).length;

  const tops = gender === "female" ? TOPS_FEMALE : TOPS_MALE;

  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* ── 헤더 ───────────────────────────────────────────────── */}
      <motion.div
        className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="font-black text-xl">🎨 내 캐릭터</h1>
          <p className="text-white/40 text-xs mt-0.5">{user?.name ?? ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <HapticButton
            haptic="light"
            onClick={resetCustom}
            className="text-white/30 text-xs border border-white/10 px-3 py-1.5 rounded-full hover:text-white/60 transition-colors"
          >
            초기화
          </HapticButton>
          <HapticButton
            haptic="medium"
            onClick={handleLogout}
            className="text-red-400 text-xs border border-red-400/30 px-3 py-1.5 rounded-full hover:bg-red-400/10 transition-colors"
          >
            로그아웃
          </HapticButton>
        </div>
      </motion.div>

      {/* ── 캐릭터 프리뷰 ───────────────────────────────────────── */}
      <div
        className="relative flex items-end justify-center overflow-hidden"
        style={{ height: 300 }}
      >
        <motion.div
          key={tier}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 70% at 50% 80%, ${visual.borderColor}18 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          key={`${gender}-${tier}-${JSON.stringify(custom)}`}
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <AvatarRenderer tier={tier} gender={gender} size={240} />
        </motion.div>
      </div>

      {/* ── 하단 패널 ───────────────────────────────────────────── */}
      <div className="px-4 space-y-4 pb-10">

        {/* 성별 선택 */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">성별</label>
          <GenderSelector value={gender} onChange={setGender} />
        </motion.section>

        {/* 커스터마이징 탭 */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">꾸미기</label>

          {/* 탭 바 */}
          <div className="flex gap-2 mb-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-brand text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="bg-white/5 rounded-2xl p-4 space-y-4"
            >
              {activeTab === "face" && (
                <>
                  <OptionRow label="표정" options={MOUTHS} value={custom.mouth} onChange={(v) => setCustom({ mouth: v })} />
                  <OptionRow label="눈" options={EYES} value={custom.eyes} onChange={(v) => setCustom({ eyes: v })} />
                  <OptionRow label="눈썹" options={EYEBROWS} value={custom.eyebrows} onChange={(v) => setCustom({ eyebrows: v })} />
                  <OptionRow label="피부색" options={SKIN_COLORS} value={custom.skinColor} onChange={(v) => setCustom({ skinColor: v })} colorMode />
                </>
              )}
              {activeTab === "hair" && (
                <>
                  <OptionRow label="헤어 스타일" options={tops} value={custom.top} onChange={(v) => setCustom({ top: v })} />
                  <OptionRow label="헤어 색상" options={HAIR_COLORS} value={custom.hairColor} onChange={(v) => setCustom({ hairColor: v })} colorMode />
                </>
              )}
              {activeTab === "clothes" && (
                <>
                  <OptionRow label="옷 스타일" options={CLOTHES_LIST} value={custom.clothing} onChange={(v) => setCustom({ clothing: v })} />
                  <OptionRow label="옷 색상" options={CLOTHING_COLORS} value={custom.clothingColor} onChange={(v) => setCustom({ clothingColor: v })} colorMode />
                </>
              )}
              {activeTab === "extra" && (
                <>
                  <OptionRow label="액세서리" options={ACCESSORIES_LIST} value={custom.accessories} onChange={(v) => setCustom({ accessories: v })} />
                  {gender === "male" && (
                    <OptionRow label="수염" options={FACIAL_HAIR_LIST} value={custom.facialHair} onChange={(v) => setCustom({ facialHair: v })} />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* 현재 티어 카드 */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">현재 티어</label>
          <AnimatePresence mode="wait">
            <motion.div
              key={tier}
              className="rounded-2xl border p-4 flex items-center gap-4"
              style={{ background: visual.badgeBg, borderColor: `${visual.borderColor}40` }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${visual.borderColor}20` }}
              >
                {TIER_DISPLAY[tier].label.split(" ")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: visual.badgeText }}>
                  {tierInfo.label.split(" ").slice(1).join(" ")}
                </p>
                <p className="text-white/40 text-xs mt-0.5">{tierInfo.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-lg" style={{ color: visual.borderColor }}>{postCount}</p>
                <p className="text-white/30 text-xs">게시글</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* 착용 아이템 패널 */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">
              착용 중 ({equippedCount})
            </label>
            {equippedCount > 0 && (
              <HapticButton haptic="light" onClick={resetEquipped} className="text-white/30 text-xs hover:text-red-400 transition-colors">
                전부 벗기
              </HapticButton>
            )}
          </div>
          <EquippedPanel equipped={equipped} onUnequip={unequipItem} />
        </motion.section>

        {/* 옷가게 바로가기 */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <HapticButton
            haptic="medium"
            onClick={() => router.push("/shop")}
            className="w-full py-4 rounded-2xl font-black text-base bg-brand text-white shadow-xl shadow-brand/30"
          >
            👗 옷가게에서 구매하기
          </HapticButton>
        </motion.div>
      </div>
    </main>
  );
}
