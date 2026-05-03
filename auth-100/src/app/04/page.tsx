'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MeResponse } from './types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; user: { id: string; email: string; name: string } }

export default function Page() {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading' })
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password123')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // 페이지 로드 시 현재 로그인 상태 확인
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const res = await fetch('/04/api/me')
    const data = (await res.json()) as MeResponse
    if (data.authenticated) {
      setAuth({ status: 'authenticated', user: data.user })
    } else {
      setAuth({ status: 'unauthenticated' })
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    const res = await fetch('/04/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = (await res.json()) as { success: boolean; error?: string; user?: { id: string; email: string; name: string } }

    if (data.success && data.user) {
      setAuth({ status: 'authenticated', user: data.user })
    } else {
      setLoginError(data.error ?? '로그인에 실패했습니다')
    }

    setIsLoggingIn(false)
  }

  async function handleLogout() {
    await fetch('/04/api/logout', { method: 'POST' })
    setAuth({ status: 'unauthenticated' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            04 / JWT + httpOnly 쿠키
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">JWT 인증</h1>
          <p className="mt-1 text-sm text-gray-500">
            토큰을 httpOnly 쿠키에 저장해 XSS를 방어합니다
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {auth.status === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}

          {auth.status === 'unauthenticated' && (
            <form onSubmit={handleLogin} className="space-y-4">
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
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <Button type="submit" isLoading={isLoggingIn} className="w-full">
                로그인
              </Button>
              <p className="text-center text-xs text-gray-400">
                demo@example.com / password123
              </p>
            </form>
          )}

          {auth.status === 'authenticated' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">✓ 로그인 중</p>
                <p className="mt-1 text-sm text-green-600">{auth.user.name}</p>
                <p className="text-xs text-green-500">{auth.user.email}</p>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                <p className="font-medium">브라우저 개발자 도구 → Application → Cookies</p>
                <p className="mt-1">→ <code>token</code> 쿠키가 httpOnly로 설정돼 있음</p>
                <p className="mt-0.5">→ JS에서 <code>document.cookie</code>로 읽기 불가</p>
              </div>

              <Button variant="ghost" onClick={handleLogout} className="w-full">
                로그아웃
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• lib/auth.ts — createToken, verifyToken (jose)</li>
            <li>• 왜 localStorage가 아닌 httpOnly 쿠키인가</li>
            <li>• sameSite: &apos;lax&apos; 의 역할 (CSRF 방어)</li>
            <li>• verifyToken이 null을 반환하는 이유</li>
          </ul>
          <p className="mt-2 font-semibold text-blue-600">→ 05번에서 next-auth가 이 역할을 대신합니다</p>
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
