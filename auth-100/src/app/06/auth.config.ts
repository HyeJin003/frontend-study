// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
//
// Q: Credentials와 Google Provider의 차이가 뭔가?
// A: Credentials → 우리가 직접 authorize() 로 검증
//    Google      → OAuth 2.0 흐름으로 Google이 검증 (코드만 등록하면 됨)
//
// Q: jwt callback에서 profile?.sub 를 저장하는 이유?
// A: Google이 반환하는 사용자 고유 ID가 profile.sub 에 있음.
//    account는 최초 로그인 시에만 존재 → if (account) 조건 필수.
//
// Q: Google Cloud Console에서 뭘 설정해야 하나?
// A: OAuth 2.0 클라이언트 ID 생성
//    승인된 리다이렉트 URI: http://localhost:3001/06/api/auth/callback/google
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: OAuth 2.0 Authorization Code Flow란?
// A: ① 사용자 → Google 동의 화면 이동
//    ② 동의 → Google이 code 발급 후 callback URL로 redirect
//    ③ next-auth가 code → access_token 교환 (token endpoint)
//    ④ access_token으로 userinfo 조회 → profile 반환
//
// Q: scope: 'openid email profile' 이 기본인 이유?
// A: openid: 사용자 식별(sub), email: 이메일, profile: 이름/사진
//    추가 scope 요청 시 Google 동의 화면에 표시됨
//
// ← 05번: Credentials Provider (이메일/비밀번호 직접 검증)
// ← 06번: Google Provider (OAuth 2.0 위임)
//
// ─────────────────────────────────────────────────────────────

import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // scope 기본값: 'openid email profile' — 명시 생략 가능
    }),
  ],

  // 커스텀 로그인 페이지
  // → 기본값 /api/auth/signin 대신 /06 라우트 사용
  pages: {
    signIn: '/06',
  },

  callbacks: {
    // jwt callback: 토큰 생성/갱신 시 실행
    // account → 최초 로그인 시에만 존재 (이후 undefined)
    // profile → Google이 반환한 사용자 정보 (profile.sub = 고유 ID)
    jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.sub   // Google 고유 ID를 토큰에 저장
      }
      return token
    },

    // session callback: auth() / useSession() 호출 시 실행
    // jwt callback에서 저장한 token.id를 session으로 복사
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
