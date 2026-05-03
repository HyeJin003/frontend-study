// ── 설계 포인트 ────────────────────────────────────────────────
// Naver는 실제 사용자 데이터가 response 키 안에 중첩됨
// profile.response.id — 다른 소셜과 달리 중첩 구조 주의
// ─────────────────────────────────────────────────────────────
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: Naver OAuth에서 state 파라미터가 필요한 이유는?
// A: CSRF 공격 방지. next-auth가 자동으로 생성/검증하므로 직접 처리 불필요.
//
// Q: Kakao와 Naver Custom Provider의 차이점은?
// A: Naver는 userinfo 응답이 { response: { id, email, ... } } 형태로 중첩됨.
//    profile() 함수에서 profile.response.id 로 접근해야 함.
//
// ─────────────────────────────────────────────────────────────

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
