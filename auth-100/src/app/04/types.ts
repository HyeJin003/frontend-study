// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: JWT Payload에 뭘 담아야 하나?
//
// A: "JWT는 탈취 시 만료 전까지 무효화가 불가능" → 최소한만 담아야 함
//    - userId: DB 조회 키 (필수)
//    - email: 로그 추적용 (선택)
//    - 절대 담으면 안 되는 것: 비밀번호, 민감한 개인정보
//
// JWT 구조: header.payload.signature (Base64 인코딩)
// → payload는 누구나 디코딩 가능 → 민감 정보 절대 금지
// ─────────────────────────────────────────────────────────────

import type { JWTPayload as JoseJWTPayload } from 'jose'

// JWT 내부에 담기는 데이터
export interface JWTPayload extends JoseJWTPayload {
  sub: string   // subject — 표준 클레임: 사용자 ID
  email: string
  name: string
  // iat(발급시간), exp(만료시간)은 jose가 자동으로 추가
}

// API 응답 타입
export type MeResponse =
  | { authenticated: true;  user: { id: string; email: string; name: string } }
  | { authenticated: false; error: string }
