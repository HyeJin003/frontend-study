'use client'

// ─────────────────────────────────────────────────────────────
// TodoInput: 새 할일 입력 컴포넌트
//
// 02번에서 재사용 — 컴포넌트는 상태 관리 방식과 무관하게 재사용 가능
//   01번: onAdd → addTodo (내부에서 setTodos 호출)
//   02번: onAdd → addTodo (내부에서 dispatch 호출)
//   컴포넌트 입장에서는 onAdd(text) 호출만 하면 됨 → 변경 없음
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'

interface TodoInputProps {
  onAdd: (text: string) => void
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState<string>('')

  function handleAdd(): void {
    const trimmed = text.trim()
    if (trimmed === '') return
    onAdd(trimmed)
    setText('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
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
        maxLength={200}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="새 할일 입력"
      />
      <Button
        onClick={handleAdd}
        disabled={text.trim() === ''}
        size="md"
      >
        추가
      </Button>
    </div>
  )
}
