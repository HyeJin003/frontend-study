"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// 후광 빛줄기 16개 — 정적 배열로 외부 선언 (memo와 시너지)
const RAYS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  angle: (i / 16) * 360,
  length: 40 + (i % 3) * 15,
  delay: i * 0.08,
}));

// 상승 파티클 12개
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: -30 + (i % 7) * 10,
  delay: i * 0.18,
  duration: 1.8 + (i % 3) * 0.4,
}));

const FashionistaAura = memo(function FashionistaAura() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
      {/* ── 중심 원형 후광 ────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 60%, rgba(255,215,0,0.22) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── 회전 빛줄기 ──────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {RAYS.map((ray) => (
          <div
            key={ray.id}
            className="absolute origin-bottom"
            style={{
              bottom: "50%",
              left: "50%",
              width: 2,
              height: ray.length,
              marginLeft: -1,
              transform: `rotate(${ray.angle}deg)`,
              background: `linear-gradient(to top, rgba(255,215,0,0.5), transparent)`,
              borderRadius: 2,
            }}
          />
        ))}
      </motion.div>

      {/* ── 상승 파티클 (✦ 별) ────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-yellow-300 text-xs select-none"
            style={{ left: `calc(50% + ${p.x}px)`, bottom: 0 }}
            initial={{ y: 0, opacity: 0, scale: 0.5 }}
            animate={{
              y: [-10, -90, -120],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* ── 외곽 링 펄스 ─────────────────────────────────────── */}
      {[0, 0.4, 0.8].map((delay) => (
        <motion.div
          key={delay}
          className="absolute inset-4 rounded-full border border-yellow-400/40 pointer-events-none"
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
});

export default FashionistaAura;
