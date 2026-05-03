// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
//
// Q: Credentials + Google을 함께 쓸 때 문제가 뭔가?
// A: 같은 이메일로 두 방식으로 로그인하면 계정 충돌 발생.
//    예: demo@example.com 으로 Credentials 가입 후
//       같은 이메일의 Google 계정으로 로그인 시도 시
//       → 어떻게 처리할지 signIn callback에서 결정해야 함
//
// Q: signIn callback 반환값의 의미는?
// A: true  → 로그인 허용
//    false → 로그인 거부 (에러 페이지로)
//    '/path' → 해당 경로로 리다이렉트 (에러 메시지 전달 가능)
//
// Q: 실무에서 계정 연동은 어떻게 하나?
// A: Prisma Adapter를 쓰면 같은 이메일의 계정을 DB에서 찾아
//    linkAccount()로 연동.
//    이 예제에서는 MOCK_USERS로 단순화.
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: "OAuthAccountNotLinked 에러란 무엇인가요?"
// A: "이미 다른 방식(Credentials 등)으로 가입된 이메일로
//    소셜 로그인을 시도할 때 발생합니다.
//    signIn callback에서 직접 처리하거나 allowDangerousEmailAccountLinking 옵션으로 허용할 수 있습니다."
//
// ← 08번: Naver Custom Provider
// ← 09번: Credentials + Google 복합 + signIn callback 계정 연동
//
// ─────────────────────────────────────────────────────────────

import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

const MOCK_USERS = [
  { id: '1', email: 'demo@example.com',  password: 'password123', name: '데모 유저' },
  { id: '2', email: 'admin@example.com', password: 'admin123',    name: '관리자' },
]

export const authConfig = {
  providers: [
    // ── Provider ① Credentials (05번 패턴 재사용) ────────────
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        const user = MOCK_USERS.find(u => u.email === email && u.password === password)
        if (!user) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),

    // ── Provider ② Google ────────────────────────────────────
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: '/09',
    error:  '/09',
  },

  callbacks: {
    // ── signIn callback: 로그인 허용/거부 결정 ─────────────────
    //
    // 시나리오 A — Credentials 로그인
    //   account.provider === 'credentials' → 무조건 허용 (authorize에서 이미 검증)
    //
    // 시나리오 B — Google 로그인
    //   1. MOCK_USERS에서 user.email로 기존 가입 여부 확인
    //   2. 없으면: 새 사용자 → 허용
    //   3. 있으면: 이미 Credentials로 가입된 계정 → 에러 페이지로 리다이렉트
    //      실무: DB + Prisma Adapter로 실제 linkAccount() 호출
    //
    signIn({ user, account }) {
      // Credentials 로그인은 authorize()에서 이미 검증 완료
      if (account?.provider === 'credentials') return true

      // Google 로그인 — 이메일 중복 체크
      const existingUser = MOCK_USERS.find(u => u.email === user.email)

      if (!existingUser) {
        // 새로운 사용자 → 허용
        return true
      }

      // 이미 Credentials로 가입된 이메일 → 연동 거부
      // → /09?error=OAuthAccountNotLinked 로 리다이렉트
      return '/09?error=OAuthAccountNotLinked'
    },

    jwt({ token, user, account, profile }) {
      if (account?.provider === 'credentials' && user?.id) {
        token.id = user.id
      }
      if (account?.provider === 'google') {
        token.id = profile?.sub
      }
      return token
    },

    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
