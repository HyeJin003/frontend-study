// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: 왜 GET이 아닌 POST인가?
//
// A: 자격증명(이메일, 비밀번호)은 절대 URL에 노출되면 안 됨.
//    GET 요청의 쿼리스트링은 서버 로그, 브라우저 히스토리, 캐시에 남음.
//    POST 요청의 body는 HTTPS로 암호화 → 안전하게 전송.
//
// Q: Next.js Route Handler와 기존 pages/api 차이가 뭔가?
//
// A: pages/api → req, res 객체 기반 (Node.js 스타일)
//    Route Handler → Request/Response → Web API 표준 (Edge 호환)
//    → Vercel Edge Runtime에서 실행 가능, 글로벌 배포에 유리
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import type { LoginRequest, LoginResponse } from '../../types'

// 실제 앱에서는 DB에서 조회 — 여기서는 Mock 데이터
const MOCK_USERS = [
  { id: '1', email: 'demo@example.com', password: 'password123', name: '데모 유저' },
  { id: '2', email: 'admin@example.com', password: 'admin123', name: '관리자' },
]

export async function POST(request: Request): Promise<NextResponse<LoginResponse>> {
  // request.json() → body를 JSON으로 파싱
  // 왜 any 대신 타입을 명시하나? → 잘못된 body 형태도 타입으로 감지
  const body = (await request.json()) as LoginRequest

  // 실제 앱에서는 DB 조회 + bcrypt.compare()로 비밀번호 검증
  // 04번에서 JWT 생성까지 추가됨
  const user = MOCK_USERS.find(
    (u) => u.email === body.email && u.password === body.password,
  )

  if (!user) {
    // 401 Unauthorized: 인증 실패
    // 왜 404(Not Found)가 아닌 401인가?
    // → 404는 리소스가 없을 때, 401은 인증 자격증명이 유효하지 않을 때
    return NextResponse.json(
      { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' },
      { status: 401 },
    )
  }

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
  })
}
