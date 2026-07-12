"use client";

import { login, getMe } from "@/services/authService"
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data);
      setAuth(
        { id: 0, email: data.email, nickname: "" },
        result.data.accessToken
      );
      const me = await getMe()
      setAuth(
        { id: me.data.id, email: me.data.email, nickname: me.data.nickname },
        result.data.accessToken
      )
      router.push("/main");
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex flex-col gap-6 w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
      {errorMessage && <p className="text-sm text-red-500 font-medium">{errorMessage}</p>}
        <span className="text-sm font-medium ">이메일</span>
        <input type="email" {...register("email")} placeholder="1234@1234.com"
          className="w-full  border border-border rounded-md px-3 py-2 text-sm 
                     outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400  " />
        <span className="text-sm font-medium">비밀번호</span>
        <input type="password" {...register("password")} placeholder="비밀번호를 입력하세요" className="w-full  border border-border rounded-md px-3 py-2 text-sm 
                     outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400" />
          <Button size="lg" variant="outline" type="submit" className="mt-2">로그인 하기</Button>
        
      </form>

        {/* 구분선 */}
        <div className="flex items-center gap-2 my-2">
          <hr className="flex-1" />
          <span className="text-sm text-gray-400">또는</span>
          <hr className="flex-1"/>
        </div>

      
  {/* 소셜 버튼 */}
   <Button
      type="button"
      variant="outline"
      onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
  >
      Google로 로그인
  </Button>

  <Button
      type="button"
      variant="outline"
      onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'}
  >
      Kakao로 로그인
        </Button>  

        </div>
    </div>
  );
}
