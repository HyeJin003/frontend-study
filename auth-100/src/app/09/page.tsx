// ── 설계 포인트 ────────────────────────────────────────────────
// Credentials + Google 복합 로그인
// signIn callback → OAuthAccountNotLinked 에러 시 ?error= 쿼리로 리다이렉트
// → searchParams로 에러 감지 → 에러 메시지 표시
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import Image from 'next/image'
import { auth, signIn, signOut } from './auth'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function Page({ searchParams }: Props) {
  const session = await auth()
  const { error } = await searchParams

  async function credentialsAction(formData: FormData) {
    'use server'
    await signIn('credentials', {
      email:      formData.get('email'),
      password:   formData.get('password'),
      redirectTo: '/09',
    })
  }

  async function googleAction() {
    'use server'
    await signIn('google', { redirectTo: '/09' })
  }

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/09' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
            09 / Credentials + Google
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">복합 로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            signIn callback — 계정 연동 거부 처리
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {session?.user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
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
                  <p className="text-sm font-semibold text-purple-800">✓ 로그인 중</p>
                  <p className="text-sm text-purple-700">{session.user.name}</p>
                  <p className="text-xs text-purple-600">{session.user.email}</p>
                  <p className="mt-1 text-xs text-purple-500">ID: {session.user.id}</p>
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
            <div className="space-y-4">
              {/* OAuthAccountNotLinked 에러 — signIn callback에서 리다이렉트한 경우 */}
              {error === 'OAuthAccountNotLinked' && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  이미 이메일/비밀번호로 가입된 계정입니다.
                  <br />
                  이메일 로그인을 이용해주세요.
                </div>
              )}

              {/* ── Credentials 폼 ─────────────────────────────── */}
              <form action={credentialsAction} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue="demo@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    defaultValue="password123"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  이메일로 로그인
                </button>
              </form>

              <div className="flex items-center gap-2">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400">또는</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* ── Google 버튼 ────────────────────────────────── */}
              <form action={googleAction}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google로 로그인
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-purple-100 bg-purple-50 p-4 text-xs text-purple-800">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• signIn callback — credentials vs google 분기 처리</li>
            <li>• OAuthAccountNotLinked — 이메일 중복 시 리다이렉트</li>
            <li>• searchParams — ?error= 쿼리로 에러 감지</li>
            <li>• 테스트: demo@example.com으로 Google 로그인 시도</li>
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
