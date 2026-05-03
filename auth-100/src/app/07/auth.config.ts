// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
//
// Q: 왜 Kakao는 내장 Provider가 없나?
// A: next-auth v5에 Kakao가 아직 공식 내장되지 않음.
//    OAuthConfig<KakaoProfile>를 직접 구현해 Custom Provider로 등록.
//
// Q: profile() 함수의 역할은?
// A: Kakao API 응답(KakaoProfile)을 next-auth 표준 User 객체로 변환.
//    반환 필드: id(string), name, email, image
//    → jwt callback의 user 파라미터로 전달됨
//
// Q: clientId를 process.env로 관리하는 이유?
// A: 클라이언트에 노출되면 타인이 Kakao API를 대신 호출 가능.
//    서버 환경변수로만 접근해야 함.
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: "Custom Provider를 만들 때 필수 필드가 뭔가요?"
// A: "id, name, type, authorization(URL+scope), token(URL), userinfo(URL), profile() 함수입니다.
//    profile()은 소셜 API 응답을 next-auth User 타입으로 변환하는 함수입니다."
//
// ← 06번: Google 내장 Provider
// ← 07번: Kakao Custom Provider 직접 구현
//
// ─────────────────────────────────────────────────────────────

import type { NextAuthConfig } from 'next-auth'
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

// ── Kakao API 응답 타입 ───────────────────────────────────────
// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
interface KakaoProfile {
  id: number
  kakao_account?: {
    email?: string
    profile?: {
      nickname?:          string
      profile_image_url?: string
    }
  }
}

// ── Kakao Custom Provider ────────────────────────────────────
// OAuthConfig<KakaoProfile> → next-auth가 이해하는 OAuth 설정 객체
function KakaoProvider(options: OAuthUserConfig<KakaoProfile>): OAuthConfig<KakaoProfile> {
  return {
    id:   'kakao',
    name: 'Kakao',
    type: 'oauth',

    // ① 사용자를 보낼 Kakao 동의 화면 URL
    authorization: {
      url:    'https://kauth.kakao.com/oauth/authorize',
      params: { scope: 'profile_nickname profile_image account_email' },
    },

    // ② code → access_token 교환 엔드포인트
    token: 'https://kauth.kakao.com/oauth/token',

    // ③ access_token으로 사용자 정보 조회
    userinfo: 'https://kapi.kakao.com/v2/user/me',

    // ④ Kakao 응답 → next-auth User 변환
    // 반환 객체가 jwt callback의 user 파라미터로 전달됨
    profile(profile) {
      return {
        id:    String(profile.id),   // Kakao id는 number → 문자열 변환 필수
        name:  profile.kakao_account?.profile?.nickname  ?? null,
        email: profile.kakao_account?.email              ?? null,
        image: profile.kakao_account?.profile?.profile_image_url ?? null,
      }
    },

    ...options,
  }
}

export const authConfig = {
  providers: [
    KakaoProvider({
      clientId:     process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      // 리다이렉트 URI (Kakao 개발자 콘솔에도 등록 필요):
      // http://localhost:3001/07/api/auth/callback/kakao
    }),
  ],

  pages: {
    signIn: '/07',
  },

  callbacks: {
    // account → 최초 로그인 시에만 존재
    // profile → KakaoProfile 타입, profile.id = 카카오 고유 숫자 ID
    jwt({ token, account, profile }) {
      if (account) {
        token.id = (profile as KakaoProfile | undefined)?.id?.toString()
      }
      return token
    },

    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
