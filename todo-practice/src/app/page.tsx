"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LESSONS = [
  {
    num: "01",
    title: "useState 기본",
    desc: "Todo CRUD + 필터 + 편집을 useState만으로",
    tags: ["#useState", "#CRUD", "#filter", "#edit"],
    done: true,
    href: "/01",
    hrefBlind: "/01b",
  },
  {
    num: "02",
    title: "useReducer",
    desc: "상태 로직을 reducer로 분리하기",
    tags: ["#useReducer", "#dispatch", "#action"],
    done: true,
    href: "/02",
    hrefBlind: "/02b",
  },
  {
    num: "03",
    title: "useContext + useState",
    desc: "prop drilling 해결, Provider 패턴",
    tags: ["#useContext", "#createContext", "#Provider"],
    done: true,
    href: "/03",
    hrefBlind: "/03b",
  },
  {
    num: "04",
    title: "useContext + useReducer",
    desc: "State/Dispatch Context 분리로 리렌더 최적화",
    tags: ["#useContext", "#useReducer", "#dispatch", "#리렌더최적화"],
    done: true,
    href: "/04",
    hrefBlind: "/04b",
  },
  {
    num: "05",
    title: "useEffect 심화",
    desc: "의존성 배열과 클린업 완전 정복",
    tags: ["#useEffect", "#cleanup", "#deps"],
    done: false,
    href: null,
    hrefBlind: null,
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-lg"
      aria-label="테마 전환"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

export default function Home() {
  const doneCount = LESSONS.filter((l) => l.done).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* 헤더 */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">Todo 100</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
            {doneCount}/{LESSONS.length} 완료
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="px-6 py-10 max-w-4xl mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          useState부터 시작하는 Todo 반복 학습. 같은 앱을 다른 방법으로 계속 만든다.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
          학습 순서: 정답 읽기 → <span className="text-blue-500 font-medium">보고치기</span> → <span className="text-purple-500 font-medium">안보고치기</span>
        </p>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LESSONS.map((lesson) =>
            lesson.done ? (
              <div
                key={lesson.num}
                className="relative flex flex-col gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-5"
              >
                {/* 완료 배지 */}
                <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                  완료
                </span>
                {/* 번호 */}
                <span className="text-4xl font-black text-gray-100 dark:text-white/10 leading-none">
                  {lesson.num}
                </span>
                {/* 제목 + 설명 */}
                <div>
                  <h2 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                    {lesson.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lesson.desc}</p>
                </div>
                {/* 태그 */}
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* 보고치기 / 안보고치기 링크 */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-white/5">
                  <Link
                    href={lesson.href!}
                    className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg
                      bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400
                      hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                  >
                    보고치기 →
                  </Link>
                  <Link
                    href={lesson.hrefBlind!}
                    className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg
                      bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400
                      hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
                  >
                    안보고치기 →
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={lesson.num}
                className="relative flex flex-col gap-3 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-zinc-900 p-5 opacity-40 cursor-not-allowed select-none"
              >
                {/* 준비중 배지 */}
                <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 font-medium">
                  준비중
                </span>
                {/* 번호 */}
                <span className="text-4xl font-black text-gray-100 dark:text-white/10 leading-none">
                  {lesson.num}
                </span>
                {/* 제목 + 설명 */}
                <div>
                  <h2 className="font-semibold text-base">{lesson.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lesson.desc}</p>
                </div>
                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
