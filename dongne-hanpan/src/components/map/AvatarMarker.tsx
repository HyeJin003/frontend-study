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

/** 48px DiceBear 미니 캐릭터 */
function MiniDiceBear({ gender = "male", custom }: { gender: Gender; custom?: AvatarCustom }) {
  const svgString = useMemo(() => {
    const seed = custom ? undefined : gender;
    const avatar = createAvatar(avataaars, {
      seed: seed ?? gender,
      size: 64,
      ...(custom
        ? {
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
          }
        : {}),
      backgroundColor: ["transparent" as never],
      backgroundType: ["solid" as never],
    });
    return avatar.toString();
  }, [gender, custom]);

  return (
    <div
      style={{ width: 52, height: 52 }}
      dangerouslySetInnerHTML={{ __html: svgString }}
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
          className="rounded-full mt-0.5"
          style={{ width: 28, height: 5, background: "rgba(0,0,0,0.25)", filter: "blur(2px)" }}
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
