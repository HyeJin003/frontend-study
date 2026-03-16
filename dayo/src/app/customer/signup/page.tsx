"use client";
import { useState } from "react";
import { checkEmail, signup } from "../../../../api/user";
import { UserSign } from "../../../../type/user";
import { useRouter } from "next/navigation";
export default function SignupPage() {
  // const emailHandle;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserSign>({
    email: "",
    password: "",
    name: "",
    type: "user",
  });
  async function emailHandle() {
    const result = await checkEmail(userInfo.email);
    if (result.status === 409) {
      setMessage("이미 가입된 이메일입니다.");
    } else if (result.status === 200) {
      setMessage("사용 가능한 이메일 입니다.");
    }
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await signup(userInfo);
      console.log(result);
      if (result.ok === 1) {
        alert("회원가입이 완료되었습니다!");
        router.push("/customer/login");
      } else {
        setError(result.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      setError("서버 오류가 발생했습니다.");
    }
  }
  return (
    <main className="flex flex-col px-6 pt-12 pb-8  min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">회원가입</h1>
        <form className="flex flex-col gap-6 flex-1" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs text-gray-400">
              이메일
            </label>
            <div className="flex items-center gap-2">
              <input
                id="email"
                type="email"
                placeholder="abc123@naver.com"
                className="flex-1 border-b border-gray-300 py-2 text-sm
  outline-none focus:border-gray-700"
                value={userInfo.email}
                onChange={(event) =>
                  setUserInfo({ ...userInfo, email: event.target.value })
                }
              />
              <button
                type="button"
                onClick={emailHandle}
                className="text-xs text-gray-500 border border-gray-300 px-3 py-1.5 rounded shrink-0"
              >
                이메일 중복 체크
              </button>
            </div>
            {message && (
              <p
                className={`text-xs mt-1 ${message.includes("가능") ? "text-blue-500" : "text-red-400"}`}
              >
                {message}
              </p>
            )}
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
              className="border-b border-gray-300 py-2 text-sm       
  outline-none focus:border-gray-700"
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={userInfo.password}
              onChange={(event) =>
                setUserInfo({
                  ...userInfo,
                  password: event.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="text-xs 
  text-gray-400"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              className="border-b border-gray-300 py-2 text-sm
  outline-none focus:border-gray-700"
              value={userInfo.name}
              onChange={(event) =>
                setUserInfo({ ...userInfo, name: event.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg text-sm 
  font-medium"
          >
            가입하기
          </button>
        </form>
      </div>
    </main>
  );
}
