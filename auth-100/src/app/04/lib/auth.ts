// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: jsonwebtoken 대신 왜 jose를 쓰나?
//
// A: jsonwebtoken은 Node.js 전용 (crypto 모듈 의존)
//    jose는 Web Crypto API 기반 → Edge Runtime, Cloudflare Workers 호환
//    Next.js middleware.ts는 Edge Runtime → jose가 필수
//    → 처음부터 jose를 쓰면 어디서든 동작
//
// Q: JWT_SECRET을 왜 TextEncoder로 변환하나?// 문자열을 컴퓨터가 읽는 형식으로 변환  
//
// A: jose의 HS256 알고리즘은 CryptoKey 또는 Uint8Array를 키로 사용
//    process.env.JWT_SECRET은 string → TextEncoder로 Uint8Array 변환 필요
// ─────────────────────────────────────────────────────────────

import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from '../types'

// 개발 환경 기본값 — 프로덕션에서는 반드시 .env의 JWT_SECRET 사용
const secret = new TextEncoder().encode(
  process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production',
)

const ALGORITHM = 'HS256'    // HMAC-SHA256 — 대칭키 (서버만 서명/검증)
const EXPIRES_IN = '1h'      // 1시간 후 만료

// ── 면접 포인트 ────────────────────────────────────────────────
// Q: HS256(대칭키)과 RS256(비대칭키) 차이가 뭔가?
//
// A: HS256 → 같은 키로 서명 + 검증 → 서버 하나일 때 적합
//    RS256 → 개인키로 서명, 공개키로 검증 → MSA/다중 서버에서 유리
//    → 이 예제처럼 단일 서버면 HS256로 충분
// ─────────────────────────────────────────────────────────────

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()                   // iat: 발급 시간 자동 설정
    .setExpirationTime(EXPIRES_IN)   // exp: 만료 시간 설정
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALGORITHM],
    })
    // jwtVerify가 성공하면 payload는 검증된 상태 (위변조 불가)
    return payload as unknown as JWTPayload
  } catch {
    // 만료됐거나 서명이 맞지 않으면 null 반환
    // 왜 에러를 throw하지 않나?
    // → 미인증 상태는 예외가 아닌 정상 케이스 → null로 표현
    return null
  }
}
