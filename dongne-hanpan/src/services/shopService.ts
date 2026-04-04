import apiInstance from "./apiInstance";
import type { Product, Order, UserMe } from "@/types";

interface ProductListResponse {
  item: Product[];
}
interface UserMeResponse {
  item: UserMe;
}
interface OrderResponse {
  item: Order;
}

// ── 서버에 상품이 없을 때 보여줄 모의 상품 ─────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { _id: 1001, seller_id: 0, price: 500, shippingFees: 0, show: true, active: true,
    name: "👑 왕관 모자", mainImages: [], content: "패셔니스타의 상징! 황금 왕관 헤드웨어",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "hat" } },
  { _id: 1002, seller_id: 0, price: 300, shippingFees: 0, show: true, active: true,
    name: "🧢 힙합 비니", mainImages: [], content: "겨울 감성 니트 비니",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "winterHat1" } },
  { _id: 1003, seller_id: 0, price: 200, shippingFees: 0, show: true, active: true,
    name: "✂️ 시저컷", mainImages: [], content: "깔끔한 시저컷 헤어스타일",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "theCaesar" } },
  { _id: 1004, seller_id: 0, price: 200, shippingFees: 0, show: true, active: true,
    name: "🌀 곱슬 숏컷", mainImages: [], content: "개성 있는 곱슬 단발머리",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "shortCurly" } },
  { _id: 1005, seller_id: 0, price: 250, shippingFees: 0, show: true, active: true,
    name: "🏄 샤기컷", mainImages: [], content: "자유로운 레이어드 샤기 스타일",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "shaggy" } },
  { _id: 1006, seller_id: 0, price: 200, shippingFees: 0, show: true, active: true,
    name: "🌊 롱 웨이브", mainImages: [], content: "우아한 롱 웨이브 헤어",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "curvy" } },
  { _id: 1007, seller_id: 0, price: 250, shippingFees: 0, show: true, active: true,
    name: "🌸 업스타일 번", mainImages: [], content: "세련된 업스타일 번 헤어",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "bun" } },
  { _id: 1008, seller_id: 0, price: 300, shippingFees: 0, show: true, active: true,
    name: "🎩 드레드락", mainImages: [], content: "개성 넘치는 드레드락 스타일",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "dreads01" } },
  { _id: 1009, seller_id: 0, price: 150, shippingFees: 0, show: true, active: true,
    name: "💆 아프로헤어", mainImages: [], content: "풍성한 아프로 헤어스타일",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "top", dicebearTop: "fro" } },
  { _id: 1010, seller_id: 0, price: 400, shippingFees: 0, show: true, active: true,
    name: "🕶 선글라스", mainImages: [], content: "쿨한 선글라스 액세서리",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "accessories", dicebearAccessory: "sunglasses" } },
  { _id: 1011, seller_id: 0, price: 350, shippingFees: 0, show: true, active: true,
    name: "👓 처방 안경", mainImages: [], content: "지성미 넘치는 뿔테 안경",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "accessories", dicebearAccessory: "prescription01" } },
  { _id: 1012, seller_id: 0, price: 600, shippingFees: 0, show: true, active: true,
    name: "🥇 골드 후디", mainImages: [], content: "프리미엄 골드 컬러 후드티",
    createdAt: "", updatedAt: "", quantity: 999, buyQuantity: 0,
    extra: { layerKey: "clothing", dicebearClothing: "hoodie", dicebearColor: "d6b370" } },
];

export const shopService = {
  /** GET /products — 상품 목록 (서버 비어 있거나 오류 시 모의 상품 사용) */
  async getProducts(): Promise<Product[]> {
    try {
      const res = await apiInstance.get<ProductListResponse>("/products");
      const serverProducts = res.data.item ?? [];
      return serverProducts.length > 0 ? serverProducts : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  },

  /** GET /users/:id — 내 포인트(balance) */
  async getMyBalance(userId?: number): Promise<number> {
    if (!userId) return 0;
    const res = await apiInstance.get<UserMeResponse>(`/users/${userId}`);
    const user = res.data.item;
    return user.point ?? user.balance ?? 0;
  },

  /**
   * POST /orders — 상품 구매
   * @param productId  구매할 상품 _id
   * @param price      낙관적 업데이트 롤백용 (함수 외부에서 계산)
   */
  async buyProduct(productId: number): Promise<Order> {
    const res = await apiInstance.post<OrderResponse>("/orders", {
      products: [{ _id: productId, quantity: 1 }],
    });
    return res.data.item;
  },
};
