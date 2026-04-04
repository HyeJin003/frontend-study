"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Gender } from "@/types/avatar";
import HapticButton from "@/components/ui/HapticButton";

interface GenderSelectorProps {
  value: Gender;
  onChange: (g: Gender) => void;
}

const OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: "male",   label: "남성", emoji: "👦" },
  { value: "female", label: "여성", emoji: "👧" },
];

const GenderSelector = memo(function GenderSelector({
  value,
  onChange,
}: GenderSelectorProps) {
  return (
    <div className="flex gap-3">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <HapticButton
            key={opt.value}
            haptic="light"
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 py-3 rounded-2xl font-bold text-sm flex flex-col items-center gap-1 border transition-colors ${
              active
                ? "bg-brand/15 border-brand text-white"
                : "bg-neutral-900 border-white/10 text-white/40"
            }`}
          >
            {active && (
              <motion.div
                layoutId="gender-pill"
                className="absolute inset-0 rounded-2xl bg-brand/10 border border-brand"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
            <span className="text-2xl relative z-10">{opt.emoji}</span>
            <span className="relative z-10">{opt.label}</span>
          </HapticButton>
        );
      })}
    </div>
  );
});

export default GenderSelector;
