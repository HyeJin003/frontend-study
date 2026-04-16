'use client'

// ─────────────────────────────────────────────────────────────
// TodoInput: 새 할일 입력 컴포넌트
//
// ❓ 왜 'use client'가 필요한가?
//   → useState, 이벤트 핸들러(onChange, onKeyDown)는
//     브라우저에서만 동작 → 클라이언트 컴포넌트 필수
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'

interface TodoInputProps {
  onAdd: (text: string) => void // 부모가 "추가 로직"을 주입
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  // ❓ 왜 input 값을 state로 관리하는가? (controlled input)
  //   → React가 input 값을 항상 알고 있어야 유효성 검사, 초기화 가능
  //   → value={text} + onChange 쌍이 없으면 uncontrolled (19번 비교)
  const [text, setText] = useState<string>('')

  function handleAdd(): void {
    // trim(): 앞뒤 공백 제거 → "   " 만 입력한 경우 방지
    const trimmed = text.trim()

    // 빈 문자열이면 아무것도 안 함 (early return 패턴)
    if (trimmed === '') return

    onAdd(trimmed)
    setText('') // 추가 후 입력창 초기화
  }

  // ❓ onKeyDown vs onKeyPress?
  //   → onKeyPress는 deprecated (표준에서 제거됨)
  //   → onKeyDown: 모든 키 입력 감지 (권장)
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      // 한국어 IME 조합 중 Enter 두 번 발생하는 버그 방지
      // nativeEvent.isComposing: 아직 조합 중이면 true
      if (e.nativeEvent.isComposing) return
      handleAdd()
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할일을 입력하세요..."
        // maxLength: XSS 방어 1차선 (서버에서도 검증 필요)
        maxLength={200}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        // aria-label: input에 label이 없을 때 스크린 리더에 제공
        aria-label="새 할일 입력"
      />
      <Button
        onClick={handleAdd}
        // text가 비어있으면 버튼 비활성화 → 불필요한 빈 추가 방지
        disabled={text.trim() === ''}
        size="md"
      >
        추가
      </Button>
    </div>
  )
}
