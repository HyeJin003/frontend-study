'use client'

// ← 09번: context 내부에서 filteredTodos, activeCount가 useMemo로 안정화됨
//    → 컴포넌트 구조는 08번과 동일 — 차이는 context.tsx 내부에 있음

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useTodoDispatch } from '../context'
import Button from '@/components/ui/Button'

export default function TodoInput() {
  const dispatch = useTodoDispatch()
  const [text, setText] = useState('')

  function handleAdd() {
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD', text: trimmed })
    setText('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd()
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력하세요"
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
          placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <Button onClick={handleAdd} disabled={!text.trim()}>추가</Button>
    </div>
  )
}
