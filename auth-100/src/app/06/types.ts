// ── 설계 포인트 ────────────────────────────────────────────────
// Google OAuth에서 사용자 고유 ID → profile.sub (subject identifier)
// next-auth Session에 기본으로 id가 없으므로 declare module로 직접 확장
// ─────────────────────────────────────────────────────────────
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: Google OAuth에서 사용자 고유 ID는 어디서 오나요?
// A: profile.sub — Google이 발급하는 subject identifier.
//    같은 Google 계정이라면 앱이 달라도 항상 동일한 값.
//
// Q: DefaultSession['user']에는 어떤 필드가 이미 있나요?
// A: name, email, image — id는 없으므로 직접 추가해야 한다
//
// ─────────────────────────────────────────────────────────────

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string   // jwt callback에서 token.id로 저장한 값
    } & DefaultSession['user']
  }
}
