"use client";

import { memo, useMemo } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { motion } from "framer-motion";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import type { LatLng } from "@/hooks/useMap";
import type { AvatarTier } from "@/types";
import type { Gender } from "@/types/avatar";
import type { AvatarCustom } from "@/store/useAvatarStore";
import { TIER_VISUAL } from "./tierConfig";

interface AvatarMarkerProps {
  position: LatLng;
  tier: AvatarTier;
  gender?: Gender;
  custom?: AvatarCustom;
  username?: string;
}

// clothingColor 코드 → hex 매핑
const CLOTHES_COLOR_MAP: Record<string, string> = {
  black: "#262e33", blue01: "#65c9ff", blue02: "#5199e4", blue03: "#25557c",
  gray01: "#929598", gray02: "#b2bec3", heather: "#3c4f5c", pastelBlue: "#b1e2ff",
  pastelGreen: "#a7ffc4", pastelOrange: "#ffdeb5", pastelRed: "#ffafb9",
  pastelYellow: "#ffffb1", pink: "#ff488e", red: "#ff5c5c", white: "#f8f8f8",
  d6b370: "#d6b370",
};

/** 전신 avataaars 캐릭터 — 상반신 SVG + 하반신 SVG 분리 렌더링 */
function MiniDiceBear({ gender = "male", custom }: { gender: Gender; custom?: AvatarCustom }) {
  const avatarSvg = useMemo(() => {
    const avatar = createAvatar(avataaars, {
      seed: custom ? `${custom.top}-${custom.hairColor}-${gender}` : gender,
      size: 280,
      ...(custom ? {
        mouth: [custom.mouth as never],
        eyes: [custom.eyes as never],
        eyebrows: [custom.eyebrows as never],
        top: [custom.top as never],
        hairColor: [custom.hairColor as never],
        skinColor: [custom.skinColor as never],
        clothing: [custom.clothing as never],
        clothesColor: [custom.clothingColor as never],
        accessories: [custom.accessories as never],
        accessoriesProbability: custom.accessories === "blank" ? 0 : 100,
        facialHair: [custom.facialHair as never],
        facialHairProbability: custom.facialHair === "blank" || gender === "female" ? 0 : 100,
      } : {}),
      backgroundColor: ["transparent" as never],
      backgroundType: ["solid" as never],
    });
    return avatar.toString()
      .replace(/width="[^"]*"/, 'width="100%"')
      .replace(/height="[^"]*"/, 'height="100%"');
  }, [gender, custom]);

  const pantsColor = useMemo(() => {
    if (!custom?.clothingColor) return "#5199e4";
    return CLOTHES_COLOR_MAP[custom.clothingColor] ?? `#${custom.clothingColor}`;
  }, [custom?.clothingColor]);

  return (
    <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 상반신: avataaars 원본 */}
      <div style={{ width: 80, height: 80, overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: avatarSvg }} />
      {/* 하반신: 허리 + 다리 + 신발 */}
      <svg width="80" height="66" viewBox="0 0 80 66" style={{ marginTop: -12, display: "block" }}>
        {/* 허리 연결부 (셔츠 하단과 겹침) */}
        <rect x="20" y="0" width="40" height="18" rx="5" fill={pantsColor} />
        {/* 왼쪽 다리 */}
        <rect x="20" y="12" width="16" height="40" rx="5" fill={pantsColor} />
        {/* 오른쪽 다리 */}
        <rect x="44" y="12" width="16" height="40" rx="5" fill={pantsColor} />
        {/* 왼쪽 신발 */}
        <ellipse cx="28" cy="57" rx="13" ry="6" fill="#1a1a2e" />
        {/* 오른쪽 신발 */}
        <ellipse cx="52" cy="57" rx="13" ry="6" fill="#1a1a2e" />
      </svg>
    </div>
  );
}

const FashionistAura = memo(function FashionistAura() {
  return (
    <>
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ inset: -8, background: "conic-gradient(from 0deg, transparent 60%, #FFD700 80%, #FFF176 90%, transparent 100%)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      {[0, 0.5].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border border-yellow-400/60 pointer-events-none"
          animate={{ scale: [1, 1.9], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }} />
      ))}
    </>
  );
});

const TerroristEffects = memo(function TerroristEffects() {
  return (
    <motion.div className="absolute inset-0 rounded-full pointer-events-none"
      animate={{ boxShadow: ["0 0 0 0px rgba(107,158,60,0.6)", "0 0 0 10px rgba(107,158,60,0)"] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }} />
  );
});

function AvatarMarkerInner({ position, tier, gender = "male", custom, username = "나" }: AvatarMarkerProps) {
  const visual = TIER_VISUAL[tier];

  return (
    <CustomOverlayMap position={position} yAnchor={1.1}>
      <motion.div
        className="flex flex-col items-center select-none"
        animate={tier === "TERRORIST" ? { rotate: [-2, 2, -2], y: [0, 2, 0] } : {}}
        transition={tier === "TERRORIST" ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        {/* 이름 말풍선 */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full shadow-md text-xs font-bold whitespace-nowrap mb-1"
          style={{ background: visual.badgeBg, color: visual.badgeText }}
        >
          {visual.emoji} {username}
        </motion.div>

        {/* 캐릭터 + 이펙트 */}
        <div className="relative flex items-end justify-center">
          {tier === "FASHIONISTA" && <FashionistAura />}
          {tier === "TERRORIST" && <TerroristEffects />}
          {tier === "NORMAL" && (
            <motion.div
              className="absolute inset-x-0 bottom-0 rounded-full pointer-events-none"
              style={{ height: "30%", background: `${visual.borderColor}22` }}
              animate={{ scaleX: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {tier === "FASHIONISTA" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none z-10">👑</div>
            )}
            <MiniDiceBear gender={gender} custom={custom} />
          </motion.div>
        </div>

        {/* 발 그림자 */}
        <motion.div
          className="rounded-full"
          style={{ width: 70, height: 10, background: "rgba(0,0,0,0.3)", filter: "blur(5px)", marginTop: 2 }}
          animate={{ scaleX: [1, 0.8, 1], opacity: [0.5, 0.25, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </CustomOverlayMap>
  );
}

const AvatarMarker = memo(AvatarMarkerInner, (prev, next) =>
  prev.tier === next.tier &&
  prev.gender === next.gender &&
  prev.position.lat === next.position.lat &&
  prev.position.lng === next.position.lng &&
  prev.username === next.username &&
  JSON.stringify(prev.custom) === JSON.stringify(next.custom),
);

export default AvatarMarker;
