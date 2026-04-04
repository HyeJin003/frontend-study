// ────────────────────────────────────────────────────────────────────────────
// Avatar System Types
// ────────────────────────────────────────────────────────────────────────────

/** 캐릭터 성별 */
export type Gender = "male" | "female";

/** 활동량 기반 티어 */
export type AvatarTier = "FASHIONISTA" | "NORMAL" | "TERRORIST";

export const AVATAR_TIER_THRESHOLD = {
  FASHIONISTA: 10,
  NORMAL: 3,
} as const;

/**
 * 캐릭터를 구성하는 렌더링 레이어 순서
 * z-index: body(0) → shoes(1) → bottom(2) → top(3) → accessory(4) → head(5)
 */
export type AvatarLayerKey =
  | "body"
  | "head"
  | "top"
  | "bottom"
  | "shoes"
  | "accessory";

export const LAYER_Z_INDEX: Record<AvatarLayerKey, number> = {
  body:      0,
  shoes:     1,
  bottom:    2,
  top:       3,
  accessory: 4,
  head:      5,
};

/** 상점에서 구매해 착용한 아이템 */
export interface EquippedItem {
  /** 상품 _id (서버 기준) */
  productId: number;
  /** 어느 레이어를 덮어쓰는지 */
  layerKey: AvatarLayerKey;
  /**
   * 이 아이템의 이미지 경로 (public 기준)
   * e.g. /assets/avatar/items/42/top.png
   */
  imagePath: string;
  name: string;
}

/** 레이어 1개의 렌더 데이터 */
export interface AvatarLayerData {
  key: AvatarLayerKey;
  /** absolute 경로 or null (레이어 없음 → 렌더 스킵) */
  src: string | null;
  zIndex: number;
  /** 레이어가 유료 아이템으로 교체된 경우 true */
  isEquipped: boolean;
}

/** 전체 아바타 렌더 상태 */
export interface AvatarRenderState {
  gender: Gender;
  tier: AvatarTier;
  layers: AvatarLayerData[];
  currentEquipped: Partial<Record<AvatarLayerKey, EquippedItem>>;
}
