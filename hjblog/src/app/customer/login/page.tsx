"use client";

import Link from "next/link";
import { useState } from "react";
import { userLogin } from "../../../../api/user";
import { useRouter } from "next/navigation";

export default function Login() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(userInfo);
    try {
      const result = await userLogin(userInfo);
      if (result.ok === 1) {
        const { accessToken, refreshToken } = result.item.token;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        alert("로그인에 성공했습니다!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  }

  return (
    <>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <div>이메일</div>
        <input
          type="text"
          name="email"
          placeholder="ddd@naver.com"
          value={userInfo.email}
          onChange={handleChange}
        />
        <div>비밀번호</div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={userInfo.password}
          onChange={handleChange}
        />
        <button type="submit">로그인</button>
        <Link href="/customer/signup">회원가입</Link>
      </form>
    </>
  );
}
