import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// ─────────────────────────────────────────────────────────────
// next/font를 사용하는 이유:
//   1. 빌드 타임에 폰트를 번들링 → 외부 네트워크 요청 없음
//   2. layout shift(CLS) 방지 → Core Web Vitals 개선
//   3. CSS 변수로 Tailwind와 자연스럽게 연동
// ─────────────────────────────────────────────────────────────
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// generateMetadata vs export const metadata:
//   - 정적 메타데이터 → export const (빌드 타임 결정)
//   - 동적 메타데이터 → generateMetadata 함수 (런타임 결정)
export const metadata: Metadata = {
  title: 'Todo 100 — React 완전정복',
  description: '동일한 Todo를 100가지 방법으로 구현하는 학습 프로젝트',
}

// RootLayout은 모든 페이지의 공통 껍데기
// children = 각 page.tsx가 렌더링되는 위치
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
