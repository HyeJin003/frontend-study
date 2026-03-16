"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("accessToken");
  });

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setIsLogin(false);
  }
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <span className="font-bold text-lg">Dayo</span>
      <div className="flex gap-2">
        {isLogin ? (
          <div className="flex gap-2">
            <button>프로필</button>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/customer/login">로그인</Link>
            {/* <Link href="/customer/signup">회원가입</Link> */}
          </div>
        )}
      </div>
      {/* 상단 바: 다크모드, 로그인/프로필 */}
      {/* 로고 + 검색창 */}
      {/* 네비게이션 */}
      {/* 데스크탑 */}
      {/* 모바일 */}
    </header>
  );
}
