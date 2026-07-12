"use client";

import { useRouter } from "next/navigation";
import { signup } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupForm } from "@/lib/schemas/auth.schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const { confirmPassword, ...requestBody } = data;
      await signup(requestBody);
      router.push("/auth/login");
    } catch (error) {
      setErrorMessage("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
       <div className="flex flex-col gap-6 w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">회원가입</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full max-w-md px-4">
             <span className="text-sm font-medium ">이메일</span>
          <input type="email" {...register("email")} placeholder="abc123@abc.com"
            className="w-full border border-border
                        rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400/50" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
             <span className="text-sm font-medium ">비밀번호</span>

          <input type="password" {...register("password")} placeholder="비밀번호를 입력해 주세요"
          className="w-full border border-border
                        rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400/50"/>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
             <span className="text-sm font-medium ">비밀번호 확인</span>

          <input type="password" {...register("confirmPassword")} placeholder="비밀번호 확인"
          className="w-full border border-border
                        rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400/50"/>
          {errors.confirmPassword && <p  className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
             <span className="text-sm font-medium ">닉네임</span>

          <input type="text" {...register("nickname")} placeholder="닉네임을 입력해주세요"
          className="w-full border border-border
                        rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400/50"
          />
          {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname.message}</p>}

          {errorMessage && <p>{errorMessage}</p>}
          <Button type="submit" size="lg" variant="outline" className="w-full">회원가입하기</Button>
        </form>
        </div>
    </div>
  );
}
