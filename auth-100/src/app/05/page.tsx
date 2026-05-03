// ── 설계 포인트 ────────────────────────────────────────────────
// 이 파일은 async Server Component
// → auth() 함수로 서버에서 바로 세션 확인
// → useSession() 훅은 클라이언트 전용, 여기서는 불필요
//
// Server Component에서 next-auth를 쓰는 장점:
//   - 세션 확인을 위한 추가 API 요청 없음 (04번과 다른 점)
//   - 페이지 접근 시 이미 세션 상태를 알고 있음 → 빠른 초기 렌더
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'
import { auth, signIn, signOut } from './auth'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // Next.js 15 — searchParams는 비동기
  const { error } = await searchParams

  // auth() → 현재 요청의 세션 반환 (없으면 null)
  const session = await auth()

  // ── Server Actions ───────────────────────────────────────────
  // 'use server' → 이 함수는 서버에서만 실행, 클라이언트에서 호출 가능
  async function loginAction(formData: FormData) {
    'use server'
    try {
      await signIn('credentials', {
        email:      formData.get('email'),
        password:   formData.get('password'),
        redirectTo: '/05',            // 로그인 성공 시 /05로 리다이렉트
      })
    } catch (err) {
      // next-auth는 성공 시에도 redirect를 throw함
      // → AuthError가 아닌 것은 redirect — 반드시 re-throw
      if (err instanceof AuthError) {
        // CredentialsSignin: 잘못된 자격증명
        redirect('/05?error=' + err.type)
      }
      throw err
    }
  }

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/05' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            05 / next-auth Credentials
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">next-auth 로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            auth() 로 서버에서 세션을 확인합니다
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {session?.user ? (
            // ── 로그인된 상태 ─────────────────────────────────────
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">✓ 로그인 중</p>
                <p className="mt-1 text-sm text-green-600">{session.user.name}</p>
                <p className="text-xs text-green-500">{session.user.email}</p>
                <p className="mt-1 text-xs text-green-400">ID: {session.user.id}</p>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                <p className="font-medium">세션 객체 (session callback 결과)</p>
                <pre className="mt-1 overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>

              {/* form + Server Action = 로그아웃 */}
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
            <form action={loginAction} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">
                    {error === 'CredentialsSignin'
                      ? '이메일 또는 비밀번호가 올바르지 않습니다'
                      : '로그인에 실패했습니다'}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="demo@example.com"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue="password123"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                로그인
              </button>

              <p className="text-center text-xs text-gray-400">
                demo@example.com / password123
              </p>
            </form>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• auth.config.ts vs auth.ts 분리 이유 (Edge 호환)</li>
            <li>• authorize() 함수의 반환값과 역할</li>
            <li>• jwt callback → session callback 흐름</li>
            <li>• Server Action에서 signIn 에러 처리 (AuthError re-throw)</li>
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
