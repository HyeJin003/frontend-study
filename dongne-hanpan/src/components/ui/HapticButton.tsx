"use client";

import { forwardRef, useCallback } from "react";
import { motion, useAnimation, type HTMLMotionProps } from "framer-motion";
import { useHaptic, type HapticPattern } from "@/hooks/useHaptic";

export type { HapticPattern };

interface HapticButtonProps extends HTMLMotionProps<"button"> {
  haptic?: HapticPattern;
  disabled?: boolean;
}

/**
 * 햅틱 피드백 + 탄성 스케일 바운스 내장 버튼
 *
 * whileTap의 단순 scale 타겟 + useAnimation으로
 * [1 → 0.92 → 1.04 → 1] 키프레임 시퀀스를 안전하게 실행
 */
const HapticButton = forwardRef<HTMLButtonElement, HapticButtonProps>(
  function HapticButton(
    { haptic = "light", disabled, onClick, children, ...props },
    ref,
  ) {
    const { vibrate } = useHaptic();
    const controls = useAnimation();

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        vibrate(haptic);
        // 탄성 바운스: 0.92 → 1.04 → 1
        await controls.start({
          scale: [1, 0.92, 1.04, 1],
          transition: { duration: 0.28, ease: "easeOut" },
        });
        onClick?.(e);
      },
      [disabled, haptic, vibrate, controls, onClick],
    );

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        animate={controls}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

export default HapticButton;
