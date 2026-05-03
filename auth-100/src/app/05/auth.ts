// ── 설계 포인트 ────────────────────────────────────────────────
// auth.config.ts vs auth.ts 역할 분리:
//
//   auth.config.ts → Edge-safe 설정 (providers, callbacks, pages)
//   auth.ts        → NextAuth() 초기화 + handlers/auth/signIn/signOut export
//
// basePath 설정 이유:
//   기본값은 /api/auth → 모든 next-auth 내부 라우트가 /api/auth/... 로 매핑
//   이 예제에서 Route Handler가 /05/api/auth/[...nextauth] 위치
//   → basePath를 /05/api/auth 로 변경해야 올바른 경로 사용
// ─────────────────────────────────────────────────────────────

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import './types'   // next-auth 타입 확장 적용

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // 이 Next.js 앱에서 /05 경로에 격리된 auth 인스턴스를 만들기 위한 설정
  // AUTH_SECRET 환경변수 필수 → .env.example 참고
  basePath: '/05/api/auth',
})
