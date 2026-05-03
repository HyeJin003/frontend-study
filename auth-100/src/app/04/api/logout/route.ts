import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()

  // 쿠키 삭제 = 만료 시간을 과거로 설정
  // maxAge: 0 또는 expires: past date → 브라우저가 쿠키를 삭제
  cookieStore.delete('token')

  return NextResponse.json({ success: true })
}
