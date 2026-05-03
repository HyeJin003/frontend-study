// 인덱스 페이지 — Server Component (기본값)
// 'use client' 없으므로 서버에서 렌더링, useState/useEffect 사용 불가

import Link from 'next/link'

type LevelColor = 'green' | 'yellow' | 'orange' | 'blue'

interface AuthExercise {
  id: number
  title: string
  keyword: string
  level: LevelColor
  available: boolean
}

const AUTH_EXERCISES: readonly AuthExercise[] = [
  // ── LEVEL 1: 기초 로그인 UI ──────────────────────────────
  { id: 1,  title: '로그인 폼',                    keyword: 'useState',                         level: 'green',  available: true  },
  { id: 2,  title: '회원가입 폼',                  keyword: 'React Hook Form + Zod',            level: 'green',  available: true  },
  { id: 3,  title: 'Route Handlers',              keyword: 'POST /api/auth/login',             level: 'green',  available: true  },
  { id: 4,  title: 'JWT 직접 구현',               keyword: 'httpOnly 쿠키',                    level: 'green',  available: true  },
  { id: 5,  title: 'next-auth Credentials',       keyword: 'authorize 함수',                   level: 'green',  available: true  },
  // ── LEVEL 2: 소셜 로그인 ─────────────────────────────────
  { id: 6,  title: 'Google 소셜 로그인',          keyword: 'OAuth 2.0 / scope',                level: 'yellow', available: false },
  { id: 7,  title: 'Kakao 소셜 로그인',           keyword: 'Custom Provider',                  level: 'yellow', available: false },
  { id: 8,  title: 'Naver 소셜 로그인',           keyword: 'state 파라미터 / 프로필 파싱',      level: 'yellow', available: false },
  { id: 9,  title: '계정 연동',                   keyword: 'signIn callback',                  level: 'yellow', available: false },
  { id: 10, title: '소셜 프로필 활용',             keyword: 'session callback',                 level: 'yellow', available: false },
  // ── LEVEL 3: 세션 & 미들웨어 ─────────────────────────────
  { id: 11, title: 'JWT strategy',                keyword: 'useSession / SessionProvider',     level: 'orange', available: false },
  { id: 12, title: 'Database strategy',           keyword: 'Prisma Adapter',                   level: 'orange', available: false },
  { id: 13, title: '보호된 라우트',               keyword: 'middleware.ts / matcher',          level: 'orange', available: false },
  { id: 14, title: 'RBAC',                        keyword: 'Role 기반 접근 제어',              level: 'orange', available: false },
  { id: 15, title: 'Remember me',                 keyword: '세션 만료 시간 동적 설정',          level: 'orange', available: false },
  // ── LEVEL 4: 심화 ────────────────────────────────────────
  { id: 16, title: 'Refresh Token 자동 갱신',     keyword: 'jwt callback / 토큰 만료 감지',    level: 'blue',   available: false },
  { id: 17, title: '전체 기기 로그아웃',          keyword: 'DB 세션 무효화',                   level: 'blue',   available: false },
  { id: 18, title: '비밀번호 재설정',             keyword: 'Resend 이메일 / 토큰 만료',        level: 'blue',   available: false },
  { id: 19, title: '이메일 인증',                 keyword: '미인증 계정 signIn 차단',           level: 'blue',   available: false },
  { id: 20, title: '프로필 수정',                 keyword: '현재 비밀번호 서버 검증',           level: 'blue',   available: false },
] as const

const LEVEL_META: Record<LevelColor, { bg: string; border: string; badge: string; dim: string }> = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700',   dim: 'bg-gray-50 border-gray-200' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', dim: 'bg-gray-50 border-gray-200' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dim: 'bg-gray-50 border-gray-200' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',     dim: 'bg-gray-50 border-gray-200' },
}

function padId(id: number): string {
  return String(id).padStart(2, '0')
}

export default function IndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Auth 20번 완전정복
        </h1>
        <p className="mt-3 text-gray-500">
          인증 패턴 20가지를 직접 구현하며 next-auth와 보안 개념을 체득합니다
        </p>
        <p className="mt-1 text-sm text-blue-600">
          정답지 (auth-100) — 코드를 읽고 "왜?"를 이해하세요
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AUTH_EXERCISES.map((ex) => {
          const meta = LEVEL_META[ex.level]
          const href = `/${padId(ex.id)}`

          if (ex.available) {
            return (
              <li key={ex.id}>
                <Link
                  href={href}
                  className={`
                    flex items-start gap-3 rounded-xl border p-4
                    transition-shadow duration-150 hover:shadow-md
                    ${meta.bg} ${meta.border}
                  `}
                >
                  <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${meta.badge}`}>
                    {padId(ex.id)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-800">{ex.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{ex.keyword}</p>
                  </div>
                </Link>
              </li>
            )
          }

          return (
            <li key={ex.id}>
              <div
                className={`
                  flex cursor-not-allowed items-start gap-3 rounded-xl border p-4
                  opacity-50 ${meta.dim}
                `}
              >
                <span className="shrink-0 rounded-md bg-gray-200 px-2 py-1 text-xs font-bold text-gray-500">
                  {padId(ex.id)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-500">{ex.title}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{ex.keyword}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-10 text-center text-sm text-gray-400">
        총 20개 · 완료한 항목은 auth-practice/STUDY_GUIDE.md에서 체크하세요
      </p>
    </main>
  )
}
