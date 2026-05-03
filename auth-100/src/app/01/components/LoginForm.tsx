'use client'

// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: 왜 LoginForm을 별도 컴포넌트로 분리했나?
//    page.tsx에 그냥 쓰면 안 됐나?
//
// A: page.tsx는 기본적으로 Server Component.
//    useState를 쓰려면 'use client'가 필요한데,
//    page.tsx 전체를 클라이언트로 만들면 서버 이점을 잃음.
//    → 상태가 필요한 최소 단위만 'use client'로 분리하는 것이 Best Practice.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'

// ── 면접 포인트 ────────────────────────────────────────────────
// Q: 왜 useState를 3개(email, password, error) 쓰나?
//    객체 하나로 합치면 안 되나?
//
// A: 가능하지만 권장하지 않는다.
//    email을 바꿀 때 password까지 복사해야 해서 코드가 번잡해짐.
//    React에서는 "함께 변경되는 상태"만 묶고, 독립적인 건 분리한다.
//    → 필드가 많아지면 02번처럼 React Hook Form 사용이 정답.
// ─────────────────────────────────────────────────────────────

const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'password123'

export default function LoginForm() {
  // ← 02번에서는 이 3개 useState가 useForm() 하나로 교체됨
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false); //"지금 API 요청 중인가?"   
  const [isLoggedIn , setIsLoggedIn] =  useState(false); //"로그인에 성공했는가?"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // 실제 앱에서는 여기서 API 호출 → 03번에서 Route Handler로 교체
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      // 왜 "이메일 또는 비밀번호"라고 쓰나?
      // → 어느 쪽이 틀렸는지 알려주면 "열거 공격(Enumeration Attack)" 가능
      //   → 공격자가 존재하는 이메일 계정을 수집할 수 있음
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    }

    setIsLoading(false)
  }

  if (isLoggedIn) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-700">로그인 성공!</p>
        <p className="mt-1 text-sm text-green-600">{email}</p>
        <button
          onClick={() => {
            setIsLoggedIn(false)
            setEmail('')
            setPassword('')
          }}
          className="mt-4 text-sm text-green-600 underline"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="email"
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={DEMO_EMAIL}
        required
        autoComplete="email"
      />

      <Input
        id="password"
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password123"
        required
        autoComplete="current-password"
      />

      {error && <ErrorMessage message={error} />}

      <Button type="submit" isLoading={isLoading} className="w-full">
        로그인
      </Button>

      <p className="text-center text-xs text-gray-400">
        데모 계정: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </p>
    </form>
  )
}
