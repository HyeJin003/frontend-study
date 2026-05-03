// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: 왜 auth.ts와 auth.config.ts를 따로 분리하나?
//
// A: Next.js middleware.ts는 Edge Runtime에서 실행됨.
//    Edge Runtime은 Node.js API(prisma, bcrypt 등) 사용 불가.
//    auth.ts에는 Node.js 의존 코드가 들어갈 수 있음 (DB adapter 등).
//    → auth.config.ts는 Edge-safe한 설정만 담음
//    → middleware.ts는 auth.config.ts만 import
//    → 이 분리가 next-auth 공식 권장 패턴 (13번 예제에서 자세히 배움)
// ─────────────────────────────────────────────────────────────

import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

// 실제 앱에서는 DB에서 조회 + bcrypt.compare() 비밀번호 검증
// 왜 비밀번호를 DB에 평문으로 저장하면 안 되나?
// → DB가 털렸을 때 모든 계정 비밀번호가 노출됨
// → bcrypt로 해시하면 해시값만 저장, 원본 비밀번호는 복원 불가
const MOCK_USERS = [
  { id: '1', email: 'demo@example.com',  password: 'password123', name: '데모 유저' },
  { id: '2', email: 'admin@example.com', password: 'admin123',    name: '관리자' },
]

export const authConfig = {
  providers: [
    Credentials({
      // credentials: 자동 생성 폼 설정 (우리는 커스텀 폼 사용하므로 생략 가능)
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },

      // ── 핵심 ────────────────────────────────────────────────
      // authorize: 자격증명 검증 함수
      // → 유효하면 User 객체 반환, 유효하지 않으면 null 반환
      // → null 반환 = "잘못된 자격증명" → CredentialsSignin 에러
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password,
        )

        if (!user) return null

        // 반환한 객체가 JWT payload에 담기고, 세션에서 사용 가능해짐
        return { id: user.id, email: user.email, name: user.name }
      }, 
    }),
  ],

  // 커스텀 로그인 페이지 설정
  // → 기본값: /api/auth/signin (next-auth 내장 페이지)
  // → 우리는 /05 에 직접 만든 폼을 씀
  pages: {
    signIn: '/05',
    error:  '/05',   // 에러발생 시 ?error=XXX 쿼리와 함께 이 페이지로 리다이렉트
  },

  callbacks: {
    // jwt callback: 토큰 생성/갱신 시 실행
    // user 파라미터는 최초 로그인 시만 존재 (이후 undefined)
    jwt({ token, user }) {
      if (user?.id) {
        token['id'] = user.id   // authorize()에서 반환한 id를 토큰에 저장
      }
      return token
    },

    // session callback: auth() / useSession() 호출 시 실행
    // jwt callback에서 token에 저장한 값을 session에 복사
    session({ session, token }) {
      if (token['id']) {
        session.user.id = token['id'] as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
