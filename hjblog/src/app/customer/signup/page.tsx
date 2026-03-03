"use client";

import { useCertification } from "@/app/hook/useCertification";
import { useState } from "react";
import { checkEmail, signup } from "../../../../api/user";
import { userSign } from "../../../../type/user";

export default function SignUp() {
  const { certify } = useCertification();

  // const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const [name, setName] = useState("");

  const [userInfo, setUserInfo] = useState<userSign>({
    email: "",
    password: "",
    name: "",
    type: "user",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target; // input의 name과 value를 가져옴
    setUserInfo({ ...userInfo, [name]: value });
  };
  async function emailHandle() {
    const result = await checkEmail(userInfo.email);
    console.log(result.data);
    if (result.status === 409) {
      setMessage("가입된 이메일입니다.");
    } else if (result.data.ok === 1) {
      setMessage("가입가능한 이메일입니다.");
    } else if (result.status === 422) {
      setMessage("이메일 형식이 맞지 않습니다.");
    }
  }
  async function handleResiter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(userInfo);
    try {
      const result = await signup(userInfo);
      console.log("회원가입 결과:", result);
    } catch (err) {
      console.error("회원가입 중 오류 발생:", err);
    }
  }

  return (
    <>
      <h1>회원가입</h1>
      <form onSubmit={handleResiter}>
        <div>이메일</div>
        <input
          type="text"
          name="email"
          placeholder="ddd@naver.com"
          value={userInfo.email}
          onChange={handleChange}
        />
        {error}
        {message}
        <button type="button" onClick={emailHandle}>
          중복확인
        </button>
        <div>비밀번호</div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={userInfo.password}
          onChange={handleChange}
        />
        <div>이름</div>
        <input
          type="text"
          name="name"
          placeholder="이름을 입력하세요"
          value={userInfo.name}
          onChange={handleChange}
        />
        <div>생년월일</div>
        <input type="date" />
        <div>휴대폰 번호</div>
        <input type="text" placeholder="- 제외하고 입력하세요" />
        <button type="button" onClick={certify}>
          인증요청
        </button>
        <button type="submit">가입하기</button>
      </form>
    </>
  );
}
