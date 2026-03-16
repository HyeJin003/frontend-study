"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserLoginType } from "../../../../type/user";
import { userLogin } from "../../../../api/user";
import Link from "next/link";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [userInfo, setUserInfo] = useState<UserLoginType>({
    email: "",
    password: "",
  });
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await userLogin(userInfo);
      if (result.ok === 1) {
        localStorage.setItem("accessToken", result.item.token.accessToken);
        localStorage.setItem("refreshToken", result.item.token.refreshToken);
        localStorage.setItem("userId", String(result.item._id));
        alert("로그인이 완료되었습니다!");
        router.push("/");
      } else {
        setError(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  }
  return (
    <main
      className="min-h-screen bg-white flex flex-col
  items-center px-6 pt-12 pb-8"
    >
      <div className="flex flex-col w-full max-w-sm mx-auto">
        <h1
          className="text-2xl font-bold text-gray-900
  mb-8"
        >
          로그인
        </h1>
        <form className="flex flex-col gap-6 flex-1" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs
  text-gray-400"
            >
              아이디
            </label>
            <input
              id="email"
              type="email"
              placeholder="abc@naver.com"
              className="border-b border-gray-300 py-2 text-sm
  outline-none focus:border-gray-700"
              value={userInfo.email}
              onChange={(event) =>
                setUserInfo({ ...userInfo, email: event.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs
  text-gray-400"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="border-b border-gray-300 py-2 text-sm outline-none   
  focus:border-gray-700"
              placeholder="abc@naver.com"
              value={userInfo.password}
              onChange={(event) =>
                setUserInfo({ ...userInfo, password: event.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black
  text-white py-3 rounded-lg text-sm font-medium"
          >
            로그인
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          계정이 없으신가요?
          <Link
            href="/customer/signup"
            className="text-black
  font-medium"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
