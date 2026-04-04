"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
  shape: "circle" | "star" | "rect";
}

const COLORS = ["#FFD700", "#FF8200", "#FF4444", "#44FF88", "#44AAFF", "#FF44CC"];

// 30개 파티클을 컴포넌트 외부에서 한 번만 생성 (memo와 시너지)
const PARTICLES: Particle[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  angle: (i / 30) * 360 + Math.random() * 12,
  distance: 60 + Math.random() * 80,
  color: COLORS[i % COLORS.length],
  size: 5 + Math.random() * 7,
  shape: (["circle", "star", "rect"] as const)[i % 3],
}));

interface SuccessCelebrationProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  onDone?: () => void;
}

const SuccessCelebration = memo(function SuccessCelebration({
  show,
  title = "성공! 🎉",
  subtitle = "인증 완료!",
  onDone,
}: SuccessCelebrationProps) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="celebration"
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 반투명 배경 */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 중앙 카드 */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 px-10 py-8 bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            {/* 체크 아이콘 */}
            <div className="relative">
              {/* 체크 배경 펄스 */}
              {[0, 0.15, 0.3].map((delay) => (
                <motion.div
                  key={delay}
                  className="absolute inset-0 rounded-full bg-brand/30"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.8, delay, ease: "easeOut" }}
                />
              ))}
              <motion.div
                className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/40"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              >
                <motion.span
                  className="text-white text-3xl font-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ✓
                </motion.span>
              </motion.div>
            </div>

            {/* 텍스트 */}
            <motion.h2
              className="text-white text-2xl font-black tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-white/50 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {subtitle}
            </motion.p>

            {/* 파티클 — 중앙에서 폭발 */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {PARTICLES.map((p) => {
                const rad = (p.angle * Math.PI) / 180;
                const tx = Math.cos(rad) * p.distance;
                const ty = Math.sin(rad) * p.distance;

                return (
                  <motion.div
                    key={p.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: p.size,
                      height: p.shape === "rect" ? p.size * 0.5 : p.size,
                      borderRadius:
                        p.shape === "circle"
                          ? "50%"
                          : p.shape === "rect"
                            ? "2px"
                            : "0",
                      background: p.color,
                      marginLeft: -p.size / 2,
                      marginTop: -p.size / 2,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                    animate={{
                      x: tx,
                      y: ty,
                      opacity: [1, 1, 0],
                      scale: [0, 1.2, 0.8],
                      rotate: p.angle * 2,
                    }}
                    transition={{
                      duration: 0.7 + Math.random() * 0.4,
                      delay: 0.1 + (p.id / 30) * 0.08,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SuccessCelebration;
