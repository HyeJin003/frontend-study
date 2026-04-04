"use client";

import { motion } from "framer-motion";

export default function MapSkeleton() {
  return (
    <div className="relative w-full h-full bg-neutral-900 overflow-hidden">
      {/* 지도 격자 패턴 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Skeleton 도로선들 */}
      {[
        { top: "30%", left: "0", width: "100%", height: "8px" },
        { top: "60%", left: "0", width: "100%", height: "6px" },
        { top: "0", left: "35%", width: "8px", height: "100%" },
        { top: "0", left: "70%", width: "6px", height: "100%" },
      ].map((style, i) => (
        <motion.div
          key={i}
          className="absolute bg-neutral-700 rounded"
          style={style}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* 중앙 로딩 컨텐츠 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {/* 마커 펄스 */}
        <div className="relative">
          <motion.div
            className="w-12 h-12 rounded-full bg-brand/30 border-2 border-brand"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-brand" />
          </div>
        </div>

        {/* 텍스트 */}
        <motion.p
          className="text-white/60 text-sm font-medium tracking-wide"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          내 위치를 찾는 중...
        </motion.p>

        {/* 하단 정보 카드 skeleton */}
        <div className="absolute bottom-28 left-4 right-4">
          <div className="bg-neutral-800 rounded-2xl p-4 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-neutral-700 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-neutral-700 rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
