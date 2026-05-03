import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// next/font를 쓰는 이유:
//   1. 빌드 타임 번들링 → 외부 네트워크 요청 없음 → 빠름
//   2. CLS(레이아웃 이동) 방지 → Core Web Vitals 개선
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Auth 20번 완전정복 — 정답지',
  description: '인증 패턴 20가지를 직접 구현하며 next-auth를 체득하는 학습 프로젝트',
}

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
