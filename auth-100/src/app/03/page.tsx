'use client'

// ── 설계 포인트 ────────────────────────────────────────────────
// 이 페이지는 'use client' — 왜?
// → fetch + useState로 로그인 결과를 화면에 보여줘야 함
//
// 실제 앱에서는 로그인 성공 후 router.push('/dashboard')
// → 여기서는 학습 목적으로 응답 JSON을 화면에 출력
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import type { LoginRequest, LoginResponse } from './types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function Page() {
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password123')
  const [result, setResult] = useState<LoginResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    const body: LoginRequest = { email, password }

    // /03/api/auth → 같은 Next.js 앱 내의 Route Handler 호출
    const res = await fetch('/03/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    // 왜 res.ok가 아닌 타입 판별을 쓰나?
    // → 200 응답이지만 success: false일 수 있음 (비즈니스 로직 실패)
    const data = (await res.json()) as LoginResponse
    setResult(data)
    setIsLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            03 / Route Handlers
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            POST /03/api/auth → Route Handler 호출
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {result && !result.success && (
              <ErrorMessage message={result.error} />
            )}
            <Button type="submit" isLoading={isLoading} className="w-full">
              로그인
            </Button>
            <p className="text-center text-xs text-gray-400">
              demo@example.com / password123
            </p>
          </form>

          {result?.success && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">✓ 로그인 성공</p>
              <pre className="mt-2 overflow-auto text-xs text-green-600">
                {JSON.stringify(result.user, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• 왜 GET 아닌 POST인가 (route.ts 주석)</li>
            <li>• Route Handler vs pages/api 차이</li>
            <li>• NextResponse.json()의 두 번째 인자 (status code)</li>
          </ul>
          <p className="mt-2 font-semibold text-blue-600">→ 04번에서 JWT + httpOnly 쿠키를 추가합니다</p>
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
