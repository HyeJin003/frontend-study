// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: 왜 Zod schema를 types.ts에서 정의하나?
//
// A: Zod는 "런타임 타입 검증" 도구.
//    z.infer<typeof signupSchema>로 TypeScript 타입을 자동 생성해줌.
//    → 스키마 하나로 "유효성 검증 로직"과 "TypeScript 타입"을 동시에 관리
//    → 따로 interface 정의하면 스키마와 타입이 따로 놀아서 관리가 어려움
// ─────────────────────────────────────────────────────────────

import { z } from 'zod'

// ── 면접 포인트 ────────────────────────────────────────────────
// Q: Zod와 TypeScript 타입의 차이가 뭔가?
//
// A: TypeScript 타입은 "컴파일 타임"에만 존재 → 빌드하면 사라짐
//    Zod스키마는 "런타임"에도 존재 → API 응답, 폼 데이 등 검증 가능
//    → 서버에서 받아온 데이터는 TypeScript가 검증 못함 → Zod 필요
// ─────────────────────────────────────────────────────────────

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, '이름은 2자 이상이어야 합니다'),

    email: z
      .string()
      .email('올바른 이메일 형식이 아닙니다'),

    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[A-Z]/, '대문자를 1개 이상 포함해야 합니다')
      .regex(/[0-9]/, '숫자를 1개 이상 포함해야 합니다'),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    // refine: 여러 필드를 조합한 검증 → 단일 필드 검증으로는 불가
    { message: '비밀번호가 일치하지 않습니다', path: ['confirmPassword'] },
  )

// z.infer → 스키마에서 TypeScript 타입을 자동 추출
// → interface SignupFormData를 따로 정의할 필요 없음
export type SignupFormData = z.infer<typeof signupSchema>
