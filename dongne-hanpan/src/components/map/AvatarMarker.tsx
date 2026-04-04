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

/** avataaars SVG에 SVG 다리+신발을 직접 삽입해 전신 캐릭터로 만들기 */
function appendLegs(svgStr: string, pantsColor: string, shoeColor: string): string {
  // viewBox 높이 264×280 → 264×400 으로 확장
  const expanded = svgStr
    .replace(/viewBox="0 0 264 280"/, 'viewBox="0 0 264 400"')
    .replace(/height="[^"]*"/, 'height="100%"')
    .replace(/width="[^"]*"/, 'width="100%"');

  const legs = `
    <g>
      <!-- 왼쪽 다리 -->
      <rect x="98" y="218" width="30" height="68" rx="8" fill="${pantsColor}"/>
      <!-- 오른쪽 다리 -->
      <rect x="136" y="218" width="30" height="68" rx="8" fill="${pantsColor}"/>
      <!-- 왼쪽 신발 -->
      <ellipse cx="113" cy="291" rx="24" ry="10" fill="${shoeColor}"/>
      <rect x="89" y="283" width="30" height="10" rx="4" fill="${shoeColor}"/>
      <!-- 오른쪽 신발 -->
      <ellipse cx="151" cy="291" rx="24" ry="10" fill="${shoeColor}"/>
      <rect x="145" y="283" width="30" height="10" rx="4" fill="${shoeColor}"/>
    </g>
  `;
  return expanded.replace('</svg>', legs + '</svg>');
}

/** 전신 avataaars 캐릭터 */
function MiniDiceBear({ gender = "male", custom }: { gender: Gender; custom?: AvatarCustom }) {
  const fullSvg = useMemo(() => {
    const avatar = createAvatar(avataaars, {
      seed: custom ? `${custom.top}-${custom.hairColor}-${gender}` : gender,
      size: 264,
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

    const pantsColor = custom?.clothingColor
      ? (CLOTHES_COLOR_MAP[custom.clothingColor] ?? `#${custom.clothingColor}`)
      : "#5199e4";

    return appendLegs(avatar.toString(), pantsColor, "#222233");
  }, [gender, custom]);

  return (
    <div
      style={{ width: 115, height: 175 }}
      dangerouslySetInnerHTML={{ __html: fullSvg }}
    />
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
