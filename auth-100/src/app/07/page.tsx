// ── 설계 포인트 ────────────────────────────────────────────────
// Kakao 소셜 로그인 — Custom Provider 사용
// 06번 Google과 page.tsx 패턴은 동일, provider ID만 'kakao'로 변경
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import Image from 'next/image'
import { auth, signIn, signOut } from './auth'

export default async function Page() {
  const session = await auth()

  async function loginAction() {
    'use server'
    await signIn('kakao', { redirectTo: '/07' })
  }

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/07' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
            07 / Kakao OAuth
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Kakao 소셜 로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            Custom Provider — OAuthConfig 직접 구현
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {session?.user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
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
                  <p className="text-sm font-semibold text-yellow-800">✓ Kakao 로그인 중</p>
                  <p className="text-sm text-yellow-700">{session.user.name}</p>
                  <p className="text-xs text-yellow-600">{session.user.email}</p>
                  <p className="mt-1 text-xs text-yellow-500">ID: {session.user.id}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                <p className="font-medium">세션 객체</p>
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
            <form action={loginAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-800"
                style={{ backgroundColor: '#FEE500' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.12 1.3 3.99 3.28 5.1L3.9 15.3c-.07.22.17.4.36.27l3.6-2.38c.37.05.76.08 1.14.08 4.14 0 7.5-2.69 7.5-6s-3.36-6-7.5-6z" fill="#3C1E1E"/>
                </svg>
                카카오로 로그인
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-xs text-yellow-800">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• KakaoProfile 타입 — kakao_account 중첩 구조</li>
            <li>• profile() 함수 — Kakao 응답 → next-auth User 변환</li>
            <li>• String(profile.id) — number → string 변환 이유</li>
            <li>• Kakao 개발자 콘솔 리다이렉트 URI 등록</li>
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
