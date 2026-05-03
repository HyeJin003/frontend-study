// ── 설계 포인트 ────────────────────────────────────────────────
// session.provider — jwt callback에서 token.provider에 저장된 값
// → "Google로 연결됨" 같은 provider별 UI 분기 가능
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import Image from 'next/image'
import { auth, signIn, signOut } from './auth'

export default async function Page() {
  const session = await auth()

  async function loginAction() {
    'use server'
    await signIn('google', { redirectTo: '/10' })
  }

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/10' })
  }

  const providerLabel: Record<string, string> = {
    google: 'Google',
    kakao:  'Kakao',
    naver:  'Naver',
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            10 / session.provider
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">프로필 + Provider 표시</h1>
          <p className="mt-1 text-sm text-gray-500">
            jwt → session callback 흐름 완성
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {session?.user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
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
                  <p className="text-sm font-semibold text-blue-800">✓ 로그인 중</p>
                  <p className="text-sm text-blue-700">{session.user.name}</p>
                  <p className="text-xs text-blue-600">{session.user.email}</p>
                  <p className="mt-1 text-xs text-blue-500">ID: {session.user.id}</p>
                  {/* provider 정보 — jwt callback에서 token.provider로 저장한 값 */}
                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {providerLabel[session.provider] ?? session.provider}로 연결됨
                  </p>
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
          )}
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• jwt callback — account.provider → token.provider 저장</li>
            <li>• session callback — token.provider → session.provider 복사</li>
            <li>• session.provider로 UI 분기 ("Google로 연결됨")</li>
            <li>• types.ts — Session/JWT 타입 확장으로 타입 안전성 확보</li>
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
