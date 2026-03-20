"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setIsLogin(!!localStorage.getItem("accessToken"));
  }, []);

  function handleSearch(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      router.push(`/post?keyword=${keyword}`);
    }
  }
  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setIsLogin(false);
  }
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* 로고 */}
        <Link
          href="/main"
          className="font-bold text-xl tracking-tight shrink-0"
        >
          Dayo
        </Link>

        {/* 검색창 */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="여행지, 게시글 검색"
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-200 transition-colors"
          />
        </div>

        {/* 로그인/로그아웃 */}
        <div className="flex items-center gap-3 text-sm shrink-0">
          {isLogin ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-sm text-gray-700"
              >
                프로필
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-lg shadow-md w-32 py-1 z-50">
                  <Link
                    href="/customer/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    프로필
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/customer/login"
              className="text-sm text-gray-700 font-medium"
            >
              로그인
            </Link>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="max-w-5xl mx-auto px-6 pb-2 flex flex-nowrap gap-6 text-sm text-gray-500 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <Link href="/post" className="shrink-0 whitespace-nowrap hover:text-black transition-colors">게시글</Link>
        <Link href="/travel-guide" className="shrink-0 whitespace-nowrap hover:text-black transition-colors">여행가이드</Link>
        <Link href="/itinerary" className="shrink-0 whitespace-nowrap hover:text-black transition-colors">일정</Link>
        <Link href="/currency" className="shrink-0 whitespace-nowrap hover:text-black transition-colors">환율</Link>
        <Link href="/checklist" className="shrink-0 whitespace-nowrap hover:text-black transition-colors">체크리스트</Link>
        <Link href="/weather-prep" className="shrink-0 whitespace-nowrap hover:text-black transition-colors">여행준비</Link>
      </nav>
    </header>
  );
}
