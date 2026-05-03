// ── 설계 포인트 ────────────────────────────────────────────────
// 03번 route.ts와 비교:
//   03번: 로그인 성공 → JSON만 반환
//   04번: 로그인 성공 → JWT 생성 → httpOnly 쿠키에 저장
//
// httpOnly 쿠키를 선택한 이유:
//   localStorage → JS로 접근 가능 → XSS 공격 시 토큰 탈취 가능
//   httpOnly 쿠키 → JS 접근 불가 (document.cookie로 못 읽음) → XSS 방어
//   → 인증 토큰은 항상 httpOnly 쿠키에 저장하는 것이 업계 표준
// ─────────────────────────────────────────────────────────────

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createToken } from '../../lib/auth'

const MOCK_USERS = [
  { id: '1', email: 'demo@example.com', password: 'password123', name: '데모 유저' },
  { id: '2', email: 'admin@example.com', password: 'admin123', name: '관리자' },
]

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email: string; password: string }

  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json(
      { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' },
      { status: 401 },
    )
  }

  const token = await createToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  })

  // Next.js 15 — cookies()는 async
  const cookieStore = await cookies()

  cookieStore.set('token', token, {
    httpOnly: true,    // JS 접근 차단 (XSS 방어 핵심)
    secure: process.env['NODE_ENV'] === 'production', // HTTPS에서만 전송
    sameSite: 'lax',  // CSRF 방어 (lax = 외부 사이트 GET 요청은 허용)
    maxAge: 60 * 60,  // 1시간 (초 단위)
    path: '/',
  })

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
}
