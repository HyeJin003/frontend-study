// ── 설계 포인트 ────────────────────────────────────────────────
// 이 Route Handler가 하는 일:
//   1. 요청의 쿠키에서 'token'을 꺼낸다
//   2. JWT를 검증한다 (서명 확인 + 만료 확인)
//   3. 유효하면 payload의 사용자 정보를 반환, 아니면 401
//
// 실제 앱에서는 여기서 DB 조회도 추가
// → JWT payload의 userId로 최신 사용자 정보를 DB에서 가져옴
// → "토큰이 발급된 이후 계정이 정지됐을 때" 등을 처리하기 위해
// ─────────────────────────────────────────────────────────────

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken } from '../../lib/auth'
import type { MeResponse } from '../../types'

export async function GET(): Promise<NextResponse<MeResponse>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json(
      { authenticated: false, error: '로그인이 필요합니다' },
      { status: 401 },
    )
  }

  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { authenticated: false, error: '토큰이 만료되었거나 유효하지 않습니다' },
      { status: 401 },
    )
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: payload.sub, email: payload.email, name: payload.name },
  })
}
