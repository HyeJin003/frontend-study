// ── next-auth 타입 확장 ──────────────────────────────────────
// Q: 왜 declare module을 써야 하나?
//
// A: next-auth의 Session 타입에는 기본적으로 id 필드가 없음.
//    session.user.id를 쓰면 TypeScript 에러가 남.
//    → "Declaration Merging"으로 기존 타입에 필드를 추가
//    → 모듈 보강(Module Augmentation)이라고 부름
//
// 이 파일이 프로젝트에 포함되어 있으면 next-auth 타입이 전역으로 확장됨
// ─────────────────────────────────────────────────────────────

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string   // 기본 Session에는 없는 필드 — authorize()에서 반환한 id
    } & DefaultSession['user']
  }
}

// ── 면접 포인트 ────────────────────────────────────────────────
// Q: jwt callback과 session callback의 차이가 뭔가?
//
// A: 흐름: 로그인 → authorize() → jwt callback → session callback → 클라이언트
//
//    jwt callback:
//      - 토큰 생성/갱신 시 실행
//      - 민감한 정보(refresh token 등)를 토큰에 추가 가능
//      - 클라이언트에 노출되지 않음
//
//    session callback:
//      - useSession() / auth()로 세션 조회 시 실행
//      - jwt callback에서 토큰에 담은 값을 session에 복사
//      - 클라이언트에 노출됨 → 민감 정보 절대 담지 말 것
// ─────────────────────────────────────────────────────────────
