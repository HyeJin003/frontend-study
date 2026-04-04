// ────────────────────────────────────────────────────────────────────────────
// 강사님 API 명세 기반 공통 타입
// ────────────────────────────────────────────────────────────────────────────

// ── Pagination ────────────────────────────────────────────────────────────────
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  _id: number;
  loginId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: "user" | "seller" | "admin";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserExtra {
  createdAt: string;
  updatedAt: string;
}

/** GET /users/myinfo 응답 — 포인트(balance) 포함 */
export interface UserMe extends User {
  point: number;   // 서버가 보내는 필드명
  balance: number; // 프론트 표시용 (point alias)
}

// ── Order ─────────────────────────────────────────────────────────────────────
export interface OrderProduct {
  _id: number;
  name: string;
  price: number;
  quantity: number;
  image?: ProductFile;
}

export interface Order {
  _id: number;
  user_id: number;
  state: "OS010" | "OS020" | "OS030" | "OS040"; // 주문→배송→완료→취소
  products: OrderProduct[];
  cost: {
    products: number;
    shippingFees: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ── File Upload ───────────────────────────────────────────────────────────────
export interface UploadedFile {
  path: string;
  name: string;
  originalname: string;
}

// ── Product ───────────────────────────────────────────────────────────────────
export interface ProductFile {
  _id: number;
  path: string;
  originalname: string;
  name: string;
}

export interface Product {
  _id: number;
  seller_id: number;
  price: number;
  shippingFees: number;
  show: boolean;
  active: boolean;
  name: string;
  mainImages: ProductFile[];
  content: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  buyQuantity: number;
  extra?: Record<string, unknown>;
}

// ── Post ──────────────────────────────────────────────────────────────────────
export interface PostFile {
  _id: number;
  path: string;
  originalname: string;
  name: string;
}

export interface Reply {
  _id: number;
  user_id: number;
  user: Pick<User, "_id" | "name" | "profileImage">;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: number;
  user_id: number;
  user: Pick<User, "_id" | "name" | "profileImage">;
  type: string;
  title: string;
  content: string;
  images?: PostFile[];
  views: number;
  likes: number;
  replies?: Reply[];
  createdAt: string;
  updatedAt: string;
  extra?: Record<string, unknown>;
}

// ────────────────────────────────────────────────────────────────────────────
// 동네한판 앱 전용 타입
// ────────────────────────────────────────────────────────────────────────────

// AvatarTier, AvatarLayerKey 등 아바타 관련 타입은 avatar.ts에서 단일 관리
// 하위 호환을 위해 re-export
export type { AvatarTier, AvatarLayerKey } from "./avatar";
export { AVATAR_TIER_THRESHOLD } from "./avatar";

/**
 * 인증샷 패션 등급
 * - S: 완벽한 스포츠 패션 (풀 세트 착장)
 * - A: 준수한 착장 (브랜드 아이템 포함)
 * - B: 기본 운동복 착장
 * - C: 아쉬운 착장 (일반 캐주얼)
 * - D: 패션 포기 (아무 옷이나)
 */
export type FashionTier = "S" | "A" | "B" | "C" | "D";

export const FASHION_TIER_LABEL: Record<FashionTier, string> = {
  S: "갓생 패션",
  A: "운동러버",
  B: "기본 충실",
  C: "아쉬운 도전",
  D: "오늘 그냥 왔어요",
};

export const FASHION_TIER_COLOR: Record<FashionTier, string> = {
  S: "#FF8200",
  A: "#FFD700",
  B: "#4CAF50",
  C: "#2196F3",
  D: "#9E9E9E",
};

/** 동네 운동 게시글 (Post 확장) */
export interface GamePost extends Post {
  extra: {
    sport: string;       // 종목 (e.g. "축구", "농구")
    location: string;    // 경기 장소
    date: string;        // 경기 날짜 (ISO)
    maxPlayers: number;  // 최대 인원
    currentPlayers: number;
    fashionTier?: FashionTier; // 인증샷 판정 등급
  };
}

/** 인증샷 게시글 (Post 확장) */
export interface AuthShotPost extends Post {
  extra: {
    fashionTier: FashionTier;
    sport: string;
    aiAnalyzed: boolean;
  };
}
