// ── 설계 포인트 ────────────────────────────────────────────────
// auth.config.ts vs auth.ts 역할 분리 (05번과 동일 패턴)
//   auth.config.ts → Edge-safe 설정 (providers, callbacks, pages)
//   auth.ts        → NextAuth() 초기화 + handlers/auth/signIn/signOut export
//
// basePath: '/06/api/auth'
//   → Route Handler 위치: src/app/06/api/auth/[...nextauth]/route.ts
// ─────────────────────────────────────────────────────────────

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import './types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  basePath: '/06/api/auth',
})
