'use client'

// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: 왜 React Hook Form(RHF)을 쓰나? useState로 충분하지 않나?
//
// A: 01번 LoginForm을 떠올려 보자.
//    필드가 4개(name, email, password, confirmPassword)면 useState도 4개.
//    타이핑할 때마다 4개 상태 중 하나가 바뀌어 컴포넌트 전체가 리렌더됨.
//    RHF는 ref 기반 → 타이핑해도 리렌더 없음 → 대규모 폼에서 성능 차이 큼.
//
// ── 면접 포인트 ───────────────────────────────────────────────
// Q: register vs Controller의 차이가 뭔가?
//
// A: register → ref를 input에 직접 등록 → 비제어 방식 (성능 최적)
//    Controller → state 기반 → 커스텀 UI 라이브러리와 통합 시 사용
//    → 기본 HTML input이면 register 사용이 정답
// ─────────────────────────────────────────────────────────────

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { signupSchema, type SignupFormData } from '../types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function SignupForm() {
  const [isSuccess, setIsSuccess] = useState(false) // 회원가입 안함 > 그다음에 회원가입 성공 
  const [submittedEmail, setSubmittedEmail] = useState('') //  //   제출한 이메일 저장     처음엔 빈 문자열

  const {
    register,       // input에 연결하는 함수 (ref 등록)
    handleSubmit,   // 제출 시 validate 후 onValid 실행
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    // zodResolver → Zod 스키마를 RHF 유효성 검증기로 연결
    resolver: zodResolver(signupSchema),
    // defaultValues를 설정하면 reset() 시 이 값으로 돌아감
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // handleSubmit이 Zod 유효성 검증 통과 후 onValid 호출
  // → 여기서는 errors가 비어있음이 보장됨
  async function onValid(data: SignupFormData) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmittedEmail(data.email)
    setIsSuccess(true)
    reset()
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-700">회원가입 완료!</p>
        <p className="mt-1 text-sm text-green-600">{submittedEmail}</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-sm text-green-600 underline"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <Input
        label="이름"
        // register → input의 name, ref, onChange, onBlur를 자동 등록
        {...register('name')}
        placeholder="홍길동"
        errorMessage={errors.name?.message}
      />

      <Input
        label="이메일"
        type="email"
        {...register('email')}
        placeholder="example@email.com"
        errorMessage={errors.email?.message}
        autoComplete="email"
      />

      <Input
        label="비밀번호"
        type="password"
        {...register('password')}
        placeholder="대문자+숫자 포함 8자 이상"
        errorMessage={errors.password?.message}
        autoComplete="new-password"
      />

      <Input
        label="비밀번호 확인"
        type="password"
        {...register('confirmPassword')}
        placeholder="비밀번호를 다시 입력하세요"
        errorMessage={errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        회원가입
      </Button>
    </form>
  )
}
