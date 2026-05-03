// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: API 요청/응답 타입을 왜 별도로 정의하나?
//
// A: 클라이언트(page.tsx)와 서버(route.ts)가
//    같은 타입을 공유해야 fetch body/response 형태를 보장할 수 있음.
//    → 타입이 없으면 서버가 email 대신 username을 기대해도 에러가 안 남
// ─────────────────────────────────────────────────────────────

// 클라이언트 → 서버로 보내는 데이터
export interface LoginRequest {
  email: string
  password: string
}

// 서버 → 클라이언트로 반환하는 데이터
export type LoginResponse =
  | { success: true;  user: { id: string; email: string; name: string } }
  | { success: false; error: string }
