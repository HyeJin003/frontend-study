"use client";

import { memo, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import type { AvatarCustom } from "@/store/useAvatarStore";
import type { Gender } from "@/types/avatar";

interface DiceBearAvatarProps {
  custom: AvatarCustom;
  gender: Gender;
  size?: number;
  className?: string;
}

const DiceBearAvatar = memo(function DiceBearAvatar({
  custom,
  gender,
  size = 200,
  className = "",
}: DiceBearAvatarProps) {
  const svgString = useMemo(() => {
    const avatar = createAvatar(avataaars, {
      seed: gender,
      size,
      // 표정
      mouth: [custom.mouth as never],
      eyes: [custom.eyes as never],
      eyebrows: [custom.eyebrows as never],
      // 헤어
      top: [custom.top as never],
      hairColor: [custom.hairColor as never],
      // 피부
      skinColor: [custom.skinColor as never],
      // 옷
      clothing: [custom.clothing as never],
      clothesColor: [custom.clothingColor as never],
      // 액세서리
      accessories: [custom.accessories as never],
      accessoriesProbability: custom.accessories === "blank" ? 0 : 100,
      // 수염
      facialHair: [custom.facialHair as never],
      facialHairProbability: custom.facialHair === "blank" || gender === "female" ? 0 : 100,
      // 배경 없음
      backgroundColor: ["transparent" as never],
      backgroundType: ["solid" as never],
    });
    return avatar.toString();
  }, [custom, gender, size]);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
});

export default DiceBearAvatar;
