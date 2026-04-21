'use client'

// ─────────────────────────────────────────────────────────────
// TodoInput: 새 할일 입력 컴포넌트
//
// 03번 핵심 변화:
//   ← 02번: onAdd prop을 page.tsx에서 전달받았음
//     <TodoInput onAdd={addTodo} />
//     function TodoInput({ onAdd }: { onAdd: (text: string) => void })
//
//   03번: props 없이 Context에서 직접 꺼냄
//     <TodoInput />
//     const { addTodo } = useTodoContext()
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useTodoContext } from '../context'
import Button from '@/components/ui/Button'

export default function TodoInput() {
  // ← 02번: onAdd prop으로 받았음
  const { addTodo } = useTodoContext()
  const [text, setText] = useState<string>('')

  function handleAdd(): void {
    const trimmed = text.trim()
    if (trimmed === '') return
    addTodo(trimmed)
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
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할일을 입력하세요..."
        maxLength={200}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="새 할일 입력"
      />
      <Button onClick={handleAdd} disabled={text.trim() === ''} size="md">
        추가
      </Button>
    </div>
  )
}
