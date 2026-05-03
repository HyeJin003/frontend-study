import Link from 'next/link'
import SignupForm from './components/SignupForm'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            02 / React Hook Form + Zod
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-1 text-sm text-gray-500">
            RHF + Zod로 유효성 검증과 리렌더 최적화
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SignupForm />
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
          <p className="font-semibold">📖 읽는 포인트</p>
          <ul className="mt-1 space-y-1">
            <li>• zodResolver가 하는 역할</li>
            <li>• register vs useState 차이 (리렌더 횟수)</li>
            <li>• .refine()으로 password === confirmPassword 검증</li>
            <li>• z.infer로 TypeScript 타입 자동 추출</li>
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
