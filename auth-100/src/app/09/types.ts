// ── 설계 포인트 ────────────────────────────────────────────────
// Credentials + Google 두 provider를 함께 쓸 때 계정 충돌 처리
// signIn callback에서 이메일 중복 체크 → 연동 허용 또는 거부
// ─────────────────────────────────────────────────────────────
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: signIn callback이란 무엇인가요?
// A: 로그인 시도가 일어날 때마다 실행되는 콜백.
//    true = 허용, false = 거부, '/path' = 리다이렉트.
//
// Q: 계정 연동(account linking)이 필요한 상황은?
// A: 같은 이메일로 Credentials + Google 두 가지 방식으로 가입 시도할 때.
//    DB에서 이메일로 기존 계정 조회 후 연동 또는 거부 결정.
//
// Q: 실무에서 계정 연동을 어떻게 구현하나요?
// A: Prisma Adapter의 linkAccount()를 사용하거나
//    signIn callback에서 직접 DB 조회+업데이트.
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
