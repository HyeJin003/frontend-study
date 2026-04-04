"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AvatarLayerData } from "@/types/avatar";

interface AvatarLayerProps {
  layer: AvatarLayerData;
  /** 레이어 컨테이너 크기 (px). 기본 320 */
  size?: number;
}

/**
 * 단일 PNG 레이어.
 * - src가 null이면 렌더 안 함
 * - src 변경 시 AnimatePresence로 크로스페이드
 * - 이미지 로드 실패 시 빈 div로 조용히 폴백
 */
const AvatarLayer = memo(
  function AvatarLayer({ layer, size = 320 }: AvatarLayerProps) {
    const [imgError, setImgError] = useState(false);

    if (!layer.src || imgError) return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={layer.src} // src 바뀔 때마다 fade 전환
          className="absolute inset-0"
          style={{ zIndex: layer.zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={layer.src}
            alt={layer.key}
            width={size}
            height={size}
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
            onError={() => setImgError(true)}
          />
        </motion.div>
      </AnimatePresence>
    );
  },
  // src, zIndex, isEquipped가 같으면 리렌더 스킵
  (prev, next) =>
    prev.layer.src === next.layer.src &&
    prev.layer.zIndex === next.layer.zIndex &&
    prev.layer.isEquipped === next.layer.isEquipped,
);

export default AvatarLayer;
