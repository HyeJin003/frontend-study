// ── 설계 포인트 ────────────────────────────────────────────────
// Kakao Custom Provider에서 사용자 고유 ID → profile.id (숫자)
// String(profile.id)로 문자열 변환 후 token에 저장
// ─────────────────────────────────────────────────────────────
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: Kakao Custom Provider를 직접 만드는 이유는?
// A: next-auth에 내장된 Kakao 프로바이더가 없기 때문.
//    OAuthConfig 인터페이스를 구현해 authorization/token/userinfo URL을 직접 지정.
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
