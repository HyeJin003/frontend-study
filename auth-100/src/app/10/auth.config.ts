// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
//
// Q: provider 정보를 session에 왜 저장하나?
// A: "Google로 연결됨" 같은 UI 표시에 사용.
//    어떤 소셜 계정으로 로그인했는지 클라이언트에서 알 수 없으면
//    provider별 버튼 스타일이나 안내 문구를 다르게 표시할 수 없음.
//
// Q: jwt callback → session callback 순서인 이유는?
// A: JWT 전략에서 세션을 읽을 때:
//    1. jwt callback으로 token을 먼저 만들거나 갱신
//    2. session callback에서 그 token을 받아 session 객체로 변환
//    → token에 저장 안 하면 session에 넣을 수 없음
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: "jwt callback과 session callback의 실행 시점 차이는?"
// A: "jwt callback은 로그인/토큰 갱신 시마다 실행되고,
//    session callback은 session을 읽을 때마다 실행됩니다.
//    jwt 전략에서 session()은 DB 조회 없이 token만 파싱합니다."
//
// ← 09번: signIn callback 계정 연동
// ← 10번: provider 정보를 session에 저장 (jwt → session 흐름 완성)
//
// ─────────────────────────────────────────────────────────────

import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'
import './types'

export const authConfig = {
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: '/10',
  },

  callbacks: {
    jwt({ token, user, account, profile }) {
      // 최초 로그인 시에만 account, profile이 존재
      if (account) {
        token.provider = account.provider          // 'google' | 'kakao' 등
        token.id       = profile?.sub ?? user?.id  // Google: profile.sub
      }
      return token
    },

    session({ session, token }) {
      // jwt callback에서 저장한 값을 session으로 노출
      session.provider    = token.provider ?? ''
      session.user.id     = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
