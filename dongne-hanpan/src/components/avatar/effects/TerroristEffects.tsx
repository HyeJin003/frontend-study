"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// 파리 궤도 4마리 — 타원형 경로를 시간차로 공전
const FLIES = [
  { id: 0, rx: 52, ry: 30, duration: 2.8, startAngle: 0,   offsetY: -20 },
  { id: 1, rx: 44, ry: 24, duration: 3.4, startAngle: 90,  offsetY:  10 },
  { id: 2, rx: 58, ry: 28, duration: 2.4, startAngle: 180, offsetY:  30 },
  { id: 3, rx: 48, ry: 20, duration: 3.8, startAngle: 270, offsetY: -10 },
];

/** 타원 t초 기준 x, y 좌표 반환 */
function ellipsePath(
  rx: number,
  ry: number,
  startAngle: number,
  progress: number,
): [number, number] {
  const angle = ((startAngle + progress * 360) * Math.PI) / 180;
  return [Math.cos(angle) * rx, Math.sin(angle) * ry];
}

// 절망 파티클 (…, 😮‍💨 등)
const DESPAIR = ["...", "😮‍💨", "💧", "zzz"];

const TerroristEffects = memo(function TerroristEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
      {/* ── 파리 4마리 공전 ───────────────────────────────────── */}
      {FLIES.map((fly) => {
        // Framer Motion keyframes: 360도 공전 (0° → 360°)
        const steps = 37; // 10° 단위
        const xFrames = Array.from({ length: steps }, (_, i) =>
          ellipsePath(fly.rx, fly.ry, fly.startAngle, i / (steps - 1))[0],
        );
        const yFrames = Array.from({ length: steps }, (_, i) =>
          ellipsePath(fly.rx, fly.ry, fly.startAngle, i / (steps - 1))[1] +
          fly.offsetY,
        );

        return (
          <motion.span
            key={fly.id}
            className="absolute text-sm select-none"
            style={{ left: "50%", top: "45%", translateX: "-50%", translateY: "-50%" }}
            animate={{ x: xFrames, y: yFrames }}
            transition={{ duration: fly.duration, repeat: Infinity, ease: "linear" }}
          >
            🪰
          </motion.span>
        );
      })}

      {/* ── 절망 이모티콘 float ───────────────────────────────── */}
      {DESPAIR.map((text, i) => (
        <motion.div
          key={i}
          className="absolute text-xs text-white/50 select-none font-bold"
          style={{
            left: `${20 + i * 18}%`,
            top: "10%",
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2.2,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.div>
      ))}

      {/* ── 탁한 초록 안개 ────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(107,158,60,0.15) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
});

export default TerroristEffects;
