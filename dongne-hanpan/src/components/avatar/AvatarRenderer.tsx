"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import FashionistaAura from "./effects/FashionistaAura";
import TerroristEffects from "./effects/TerroristEffects";
import DiceBearAvatar from "./DiceBearAvatar";
import { useAvatarStore, selectCustom } from "@/store/useAvatarStore";
import type { AvatarTier, Gender } from "@/types/avatar";

interface AvatarRendererProps {
  tier: AvatarTier;
  gender?: Gender;
  size?: number;
  className?: string;
}

const BREATHING: Record<AvatarTier, { scale: number[]; duration: number; rotate?: number[] }> = {
  FASHIONISTA: { scale: [1, 1.018, 1], duration: 3.2 },
  NORMAL:      { scale: [1, 1.012, 1], duration: 3.8 },
  TERRORIST:   { scale: [1, 1.006, 0.998, 1], duration: 2.6, rotate: [-0.6, 0.6, -0.4, 0] },
};

const TIER_GLOW: Record<AvatarTier, string> = {
  FASHIONISTA: "drop-shadow(0 0 18px rgba(255,215,0,0.55)) drop-shadow(0 0 6px rgba(255,180,0,0.4))",
  NORMAL:      "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
  TERRORIST:   "drop-shadow(0 0 10px rgba(107,158,60,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
};

const AvatarRenderer = memo(function AvatarRenderer({
  tier, gender = "male", size = 320, className = "",
}: AvatarRendererProps) {
  const custom = useAvatarStore(selectCustom);
  const breathing = BREATHING[tier];

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      {tier === "FASHIONISTA" && <FashionistaAura />}
      {tier === "TERRORIST"   && <TerroristEffects />}

      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: "bottom center", filter: TIER_GLOW[tier] }}
        animate={{
          scaleY: breathing.scale,
          scaleX: breathing.scale.map((s) => 1 + (s - 1) * 0.4),
          rotate: breathing.rotate ?? 0,
          ...(tier === "TERRORIST" ? { x: [0, -1, 1.5, -0.5, 0] } : {}),
        }}
        transition={{
          duration: breathing.duration,
          repeat: Infinity,
          ease: "easeInOut",
          ...(tier === "TERRORIST" ? { repeatType: "mirror" as const } : {}),
        }}
      >
        <DiceBearAvatar custom={custom} gender={gender} size={size} />

        {/* FASHIONISTA 왕관 */}
        {tier === "FASHIONISTA" && (
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: size * 0.02, fontSize: size * 0.14, lineHeight: 1, zIndex: 20 }}
          >
            👑
          </div>
        )}
      </motion.div>

      {/* 발 그림자 */}
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: size * 0.38,
          height: size * 0.04,
          background: tier === "FASHIONISTA"
            ? "radial-gradient(ellipse, rgba(255,215,0,0.3) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)",
        }}
        animate={{ scaleX: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: breathing.duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
});

export default AvatarRenderer;
