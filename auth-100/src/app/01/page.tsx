// ── 설계 포인트 ────────────────────────────────────────────────
// 이 파일은 Server Component (기본값 — 'use client' 없음)
// → LoginForm만 클라이언트, 레이아웃/타이틀은 서버에서 렌더
//
// 왜 이렇게 나누나?
//   Server Component는 HTML을 서버에서 완성해서 보내줌
//   → 빠른 첫 화면, SEO 유리
//   Client Component는 브라우저에서 JS가 실행되어야 함
//   → 상태(useState), 이벤트(onClick) 필요한 부분만 사용
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'
import LoginForm from './components/LoginForm'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            01 / useState
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            각 입력 필드를 독립적인 useState로 관리합니다
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• useState가 3개인 이유 (email, password, error)</li>
            <li>• 에러 메시지를 왜 모호하게 쓰는가 (열거 공격 방어)</li>
            <li>• LoginForm을 왜 별도 파일로 분리했는가</li>
          </ul>
          <p className="mt-2 font-semibold text-blue-600">→ 02번에서 React Hook Form으로 교체됩니다</p>
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
