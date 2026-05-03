// ── 설계 포인트 ────────────────────────────────────────────────
// provider 정보를 session에 저장 → UI에서 "Google로 연결됨" 표시 가능
// JWT 타입도 확장 → token.provider 저장 시 타입 안전성 확보
// ─────────────────────────────────────────────────────────────
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: session callback에서 token을 사용하는 이유는?
// A: jwt 전략에서 session callback은 JWT token을 받기 때문.
//    DB 조회 없이 서버리스 환경에서도 동작.
//
// Q: provider 정보를 session에 저장하는 실용적인 이유는?
// A: "Google로 연결됨" 같은 UI 표시,
//    소셜 API 직접 호출 시 어떤 토큰인지 구분.
//
// Q: JWT 타입을 확장하는 이유는?
// A: token['id'] 처럼 문자열 인덱스로 쓰면 타입 불안정.
//    declare module로 확장하면 token.id 로 타입 안전하게 접근 가능.
//
// ─────────────────────────────────────────────────────────────

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    provider: string   // 어떤 소셜로 로그인했는지 ('google' | 'kakao' 등)
    user: {
      id: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?:       string
    provider?: string
  }
}
