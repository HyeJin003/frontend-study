// ── 설계 포인트 ────────────────────────────────────────────────
// 이 파일이 하는 일:
//   next-auth의 모든 내부 라우트 요청을 처리
//   예: GET  /05/api/auth/session      → 현재 세션 반환
//       POST /05/api/auth/callback/credentials → 로그인 처리
//       POST /05/api/auth/signout      → 로그아웃 처리
//
// [...nextauth] = catch-all 라우트
// → /05/api/auth 이하 모든 경로를 이 파일이 처리
// ─────────────────────────────────────────────────────────────

import { handlers } from '../../auth'

// GET, POST만 export하면 next-auth가 필요한 라우트를 내부에서 처리
export const { GET, POST } = handlers
