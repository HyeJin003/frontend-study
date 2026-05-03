// ── 설계 포인트 ────────────────────────────────────────────────
// Google 소셜 로그인 — OAuth redirect 방식
//
// Credentials(05번)와 다른 점:
//   ① signIn('google') 호출 시 Google 동의 화면으로 redirect
//   ② redirect가 일어나므로 try/catch 불필요
//   ③ 로그인 성공 시 next-auth가 자동으로 redirectTo로 이동
//
// ── 면접 포인트 ──────────────────────────────────────────────
// Q: "소셜 로그인 Server Action에서 try/catch가 필요없는 이유?"
// A: "next-auth의 signIn('google')은 성공 시 redirect를 throw합니다.
//    Credentials와 달리 CredentialsSignin 에러가 없어서 AuthError를 잡을 필요가 없습니다."
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import Image from 'next/image'
import { auth, signIn, signOut } from './auth'

export default async function Page() {
  const session = await auth()

  // ── Server Actions ───────────────────────────────────────────
  async function loginAction() {
    'use server'
    // Credentials와 달리 try/catch 불필요
    // → signIn('google')은 Google 동의 화면으로 redirect만 함
    await signIn('google', { redirectTo: '/06' })
  }

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/06' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            06 / Google OAuth
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Google 소셜 로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            OAuth 2.0 Authorization Code Flow
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {session?.user ? (
            // ── 로그인된 상태 ─────────────────────────────────────
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt="프로필"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-green-700">✓ Google 로그인 중</p>
                  <p className="text-sm text-green-600">{session.user.name}</p>
                  <p className="text-xs text-green-500">{session.user.email}</p>
                  <p className="mt-1 text-xs text-green-400">ID: {session.user.id}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                <p className="font-medium">세션 객체 (session callback 결과)</p>
                <pre className="mt-1 overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            // ── 로그아웃 상태 ─────────────────────────────────────
            <div className="space-y-4">
              <form action={loginAction}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
                  </svg>
                  Google로 로그인
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• auth.config.ts: Google Provider scope 기본값</li>
            <li>• jwt callback: profile.sub → token.id 저장</li>
            <li>• Credentials(05)와 달리 try/catch 없는 이유</li>
            <li>• Google Cloud Console 리다이렉트 URI 설정</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← 목록으로
          </Link>
        </div>
      </div>
    </main>
  )
}
