import type { Gender, AvatarTier, AvatarLayerKey, AvatarLayerData, EquippedItem } from "@/types/avatar";
import { LAYER_Z_INDEX } from "@/types/avatar";

const ASSET_BASE = "/assets/avatar";

// ── 기본 레이어 파일명 매핑 ───────────────────────────────────────────────────
// 티어/성별별로 존재하는 레이어 목록 (없는 레이어는 null → 렌더 스킵)
const TIER_LAYERS: Record<AvatarTier, AvatarLayerKey[]> = {
  FASHIONISTA: ["body", "head", "top", "bottom", "shoes", "accessory"],
  NORMAL:      ["body", "head", "top", "bottom", "shoes"],
  TERRORIST:   ["body", "head", "top", "bottom", "shoes"],
};

/**
 * 티어·성별·레이어키를 받아 public 경로를 반환
 * e.g. getAvatarAssetPath("male", "FASHIONISTA", "top")
 *   → "/assets/avatar/male/FASHIONISTA/top.png"
 */
export function getAvatarAssetPath(
  gender: Gender,
  tier: AvatarTier,
  layerKey: AvatarLayerKey,
): string {
  return `${ASSET_BASE}/${gender}/${tier}/${layerKey}.png`;
}

/**
 * 전체 레이어 배열을 반환.
 * 유료 착용 아이템이 있는 레이어는 해당 경로로 교체.
 *
 * @param gender   - 선택된 성별
 * @param tier     - 현재 활동 티어
 * @param equipped - 상점에서 구매·착용한 아이템 맵
 */
export function buildAvatarLayers(
  gender: Gender,
  tier: AvatarTier,
  equipped: Partial<Record<AvatarLayerKey, EquippedItem>> = {},
): AvatarLayerData[] {
  const activeLayers = TIER_LAYERS[tier];

  return (Object.keys(LAYER_Z_INDEX) as AvatarLayerKey[]).map((key) => {
    const equippedItem = equipped[key];
    void activeLayers; // layers info retained for future use

    // 유료 아이템이 착용된 경우 → 아이템 이미지 우선
    if (equippedItem) {
      return {
        key,
        src: equippedItem.imagePath,
        zIndex: LAYER_Z_INDEX[key],
        isEquipped: true,
      };
    }

    // 기본 레이어는 null — CSS 캐릭터가 그리므로 PNG 불필요
    return {
      key,
      src: null,
      zIndex: LAYER_Z_INDEX[key],
      isEquipped: false,
    };
  });
}
