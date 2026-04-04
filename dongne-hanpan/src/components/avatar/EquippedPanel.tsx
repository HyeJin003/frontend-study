"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AvatarLayerKey, EquippedItem } from "@/types/avatar";
import { LAYER_Z_INDEX } from "@/types/avatar";
import HapticButton from "@/components/ui/HapticButton";

const LAYER_LABEL: Record<AvatarLayerKey, string> = {
  body:      "몸",
  head:      "모자/헤어",
  top:       "상의",
  bottom:    "하의",
  shoes:     "신발",
  accessory: "액세서리",
};

const IMG_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface EquippedPanelProps {
  equipped: Partial<Record<AvatarLayerKey, EquippedItem>>;
  onUnequip: (layerKey: AvatarLayerKey) => void;
}

const EquippedPanel = memo(function EquippedPanel({
  equipped,
  onUnequip,
}: EquippedPanelProps) {
  const equippedEntries = (Object.keys(LAYER_Z_INDEX) as AvatarLayerKey[])
    .map((k) => ({ key: k, item: equipped[k] }))
    .filter((e) => !!e.item);

  if (equippedEntries.length === 0) {
    return (
      <p className="text-white/30 text-sm text-center py-6">
        착용 중인 아이템이 없어요.<br />
        <span className="text-white/20 text-xs">옷가게에서 구매 후 착용해 보세요!</span>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {equippedEntries.map(({ key, item }) => (
          <motion.div
            key={key}
            className="flex items-center gap-3 bg-neutral-800 rounded-xl px-3 py-2 border border-white/5"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
            layout
          >
            {/* 아이템 썸네일 */}
            <div className="w-10 h-10 rounded-lg bg-neutral-700 overflow-hidden shrink-0 flex items-center justify-center">
              {item!.imagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${IMG_BASE}/${item!.imagePath}`}
                  alt={item!.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-lg">👕</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{item!.name}</p>
              <p className="text-white/30 text-xs">{LAYER_LABEL[key]}</p>
            </div>

            <HapticButton
              haptic="light"
              onClick={() => onUnequip(key)}
              className="text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded-lg transition-colors"
            >
              벗기
            </HapticButton>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default EquippedPanel;
