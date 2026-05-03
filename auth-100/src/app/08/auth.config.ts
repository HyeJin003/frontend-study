// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
//
// Q: Naver가 Kakao와 다른 점은?
// A: userinfo 응답 구조가 다름
//    Kakao: { id, kakao_account: { ... } }
//    Naver: { resultcode, message, response: { id, email, name, ... } }
//    → profile()에서 profile.response.id 로 접근해야 함
//
// Q: state 파라미터가 왜 필요한가?
// A: CSRF 공격 방지 — 요청과 콜백이 같은 세션인지 검증.
//    next-auth가 자동으로 생성/검증하므로 직접 처리 불필요.
//
// Q: 네이버 개발자 센터에서 설정할 것은?
// A: 애플리케이션 등록 → 서비스 URL, 콜백 URL 등록
//    리다이렉트 URI: http://localhost:3001/08/api/auth/callback/naver
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: "Kakao와 Naver Custom Provider의 구현 차이는?"
// A: "profile() 함수에서 데이터 접근 경로가 다릅니다.
//    Kakao는 profile.kakao_account.email,
//    Naver는 profile.response.email처럼 response 키 안에 중첩되어 있습니다."
//
// ← 07번: Kakao Custom Provider
// ← 08번: Naver Custom Provider (중첩 구조 주의)
//
// ─────────────────────────────────────────────────────────────

import type { NextAuthConfig } from 'next-auth'
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

// ── Naver API 응답 타입 ───────────────────────────────────────
// https://developers.naver.com/docs/login/profile/profile.md
// 실제 데이터가 response 키 안에 중첩되어 있음 (Kakao와 다른 점)
interface NaverProfile {
  resultcode: string
  message:    string
  response: {
    id:            string
    email?:        string
    name?:         string
    profile_image?: string
    nickname?:     string
  }
}

// ── Naver Custom Provider ────────────────────────────────────
function NaverProvider(options: OAuthUserConfig<NaverProfile>): OAuthConfig<NaverProfile> {
  return {
    id:   'naver',
    name: 'Naver',
    type: 'oauth',

    authorization: {
      url:    'https://nid.naver.com/oauth2.0/authorize',
      params: { scope: 'email name profile_image' },
      // state 파라미터: next-auth가 자동으로 처리 (CSRF 방지)
    },

    token:    'https://nid.naver.com/oauth2.0/token',
    userinfo: 'https://openapi.naver.com/v1/nid/me',

    // ← Kakao와의 차이: profile.response.xxx 로 접근
    profile(profile) {
      return {
        id:    profile.response.id,
        name:  profile.response.name  ?? profile.response.nickname ?? null,
        email: profile.response.email ?? null,
        image: profile.response.profile_image ?? null,
      }
    },

    ...options,
  }
}

export const authConfig = {
  providers: [
    NaverProvider({
      clientId:     process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      // 리다이렉트 URI (네이버 개발자 센터에도 등록 필요):
      // http://localhost:3001/08/api/auth/callback/naver
    }),
  ],

  pages: {
    signIn: '/08',
  },

  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        // Naver profile.response.id (string) — 이미 문자열이므로 변환 불필요
        token.id = (profile as NaverProfile | undefined)?.response?.id
      }
      return token
    },

    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
