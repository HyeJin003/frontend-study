'use client'

import { KeyboardEvent, useState } from 'react'
import { useTodoDispatch } from '../context'
import Button from '@/components/ui/Button'

export default function TodoInput() {
  // ← 03번: const { addTodo } = useTodoContext()
  // ← 04번: dispatch만 꺼냄 → 상태 바뀌어도 이 컴포넌트 리렌더 안 됨
  const dispatch = useTodoDispatch()
  const [text, setText] = useState<string>('')

  function handleAdd(): void {
    const trimmed = text.trim()
    if (trimmed === '') return
    dispatch({ type: 'ADD', text: trimmed })
    setText('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd()
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={200}
        placeholder="할일을 입력하세요..."
        aria-label="새 할일 입력"
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
      />
      <Button onClick={handleAdd} disabled={text.trim() === ''} size="md">
        추가
      </Button>
    </div>
  )
}
