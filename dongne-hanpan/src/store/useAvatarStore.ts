import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { Gender, AvatarTier, AvatarLayerKey, EquippedItem, AvatarLayerData } from "@/types/avatar";
import { buildAvatarLayers } from "@/utils/getAvatarAsset";

// ── 커스터마이징 옵션 ────────────────────────────────────────────────────────
export interface AvatarCustom {
  // 표정
  mouth: string;
  // 눈
  eyes: string;
  // 눈썹
  eyebrows: string;
  // 헤어 스타일
  top: string;
  // 헤어 색상
  hairColor: string;
  // 피부색
  skinColor: string;
  // 옷 스타일
  clothing: string;
  // 옷 색상
  clothingColor: string;
  // 액세서리
  accessories: string;
  // 수염 (남성)
  facialHair: string;
}

export const DEFAULT_CUSTOM_MALE: AvatarCustom = {
  mouth: "smile",
  eyes: "happy",
  eyebrows: "raisedExcitedNatural",
  top: "shortFlat",
  hairColor: "2c1b18",
  skinColor: "ffdbb4",
  clothing: "hoodie",
  clothingColor: "65c9ff",
  accessories: "blank",
  facialHair: "blank",
};

export const DEFAULT_CUSTOM_FEMALE: AvatarCustom = {
  mouth: "smile",
  eyes: "happy",
  eyebrows: "raisedExcitedNatural",
  top: "straight01",
  hairColor: "2c1b18",
  skinColor: "ffdbb4",
  clothing: "blazerAndShirt",
  clothingColor: "ff488e",
  accessories: "blank",
  facialHair: "blank",
};

interface AvatarState {
  gender: Gender;
  tier: AvatarTier;
  custom: AvatarCustom;
  currentEquipped: Partial<Record<AvatarLayerKey, EquippedItem>>;
  layers: AvatarLayerData[];
}

interface AvatarActions {
  setGender: (gender: Gender) => void;
  setTier: (tier: AvatarTier) => void;
  setCustom: (patch: Partial<AvatarCustom>) => void;
  resetCustom: () => void;
  equipItem: (item: EquippedItem) => void;
  unequipItem: (layerKey: AvatarLayerKey) => void;
  resetEquipped: () => void;
}

type AvatarStore = AvatarState & AvatarActions;

function recomputeLayers(
  gender: Gender,
  tier: AvatarTier,
  equipped: Partial<Record<AvatarLayerKey, EquippedItem>>,
): AvatarLayerData[] {
  return buildAvatarLayers(gender, tier, equipped);
}

export const useAvatarStore = create<AvatarStore>()(
  devtools(
    persist(
      (set) => ({
        gender: "male",
        tier: "NORMAL",
        custom: DEFAULT_CUSTOM_MALE,
        currentEquipped: {},
        layers: recomputeLayers("male", "NORMAL", {}),

        setGender: (gender) =>
          set((s) => ({
            gender,
            custom: gender === "female" ? { ...s.custom, top: "straight01", clothing: "blazerAndShirt" }
              : { ...s.custom, top: "shortFlat", clothing: "hoodie" },
            layers: recomputeLayers(gender, s.tier, s.currentEquipped),
          }), false, "setGender"),

        setTier: (tier) =>
          set((s) => ({
            tier,
            layers: recomputeLayers(s.gender, tier, s.currentEquipped),
          }), false, "setTier"),

        setCustom: (patch) =>
          set((s) => ({ custom: { ...s.custom, ...patch } }), false, "setCustom"),

        resetCustom: () =>
          set((s) => ({
            custom: s.gender === "female" ? DEFAULT_CUSTOM_FEMALE : DEFAULT_CUSTOM_MALE,
          }), false, "resetCustom"),

        equipItem: (item) =>
          set((s) => {
            const newEquipped = { ...s.currentEquipped, [item.layerKey]: item };
            return { currentEquipped: newEquipped, layers: recomputeLayers(s.gender, s.tier, newEquipped) };
          }, false, "equipItem"),

        unequipItem: (layerKey) =>
          set((s) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [layerKey]: _r, ...rest } = s.currentEquipped;
            return { currentEquipped: rest, layers: recomputeLayers(s.gender, s.tier, rest) };
          }, false, "unequipItem"),

        resetEquipped: () =>
          set((s) => ({
            currentEquipped: {},
            layers: recomputeLayers(s.gender, s.tier, {}),
          }), false, "resetEquipped"),
      }),
      {
        name: "dongne-avatar",
        partialize: (s) => ({ gender: s.gender, custom: s.custom, currentEquipped: s.currentEquipped }),
      },
    ),
    { name: "AvatarStore" },
  ),
);

export const selectGender   = (s: AvatarStore) => s.gender;
export const selectTier     = (s: AvatarStore) => s.tier;
export const selectLayers   = (s: AvatarStore) => s.layers;
export const selectEquipped = (s: AvatarStore) => s.currentEquipped;
export const selectCustom   = (s: AvatarStore) => s.custom;
