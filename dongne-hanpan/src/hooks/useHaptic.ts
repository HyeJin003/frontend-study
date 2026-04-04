"use client";

import { useCallback } from "react";

export type HapticPattern = "light" | "medium" | "heavy" | "success" | "error";

const PATTERNS: Record<HapticPattern, number[]> = {
  light:   [10],
  medium:  [20],
  heavy:   [40],
  success: [10, 30, 10],
  error:   [50, 30, 50],
};

/**
 * 모바일 햅틱 피드백 훅
 * - 지원 기기: vibrate API가 있는 Android Chrome 등
 * - 미지원(iOS Safari 등)은 조용히 무시
 */
export function useHaptic() {
  const vibrate = useCallback((pattern: HapticPattern = "light") => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(PATTERNS[pattern]);
    }
  }, []);

  return { vibrate };
}
