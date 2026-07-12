import { z } from 'zod';

 // 로그인 스키마
  export const loginSchema = z.object({
    email: z.string().email("이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  })

    // 회원가입 스키마 = 로그인 스키마 + nickname
export const signupSchema = z.object({
  email: z.string().email("이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  confirmPassword: z.string(),
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지않습니다",
  path: ["confirmPassword"],
});
export type LoginForm = z.infer<typeof loginSchema>
export type SignupForm = z.infer<typeof signupSchema>