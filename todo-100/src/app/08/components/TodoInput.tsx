'use client'

// ← 08번: dispatch는 useReducer가 이미 안정적 참조 보장
//    → dispatch를 직접 쓰는 이 컴포넌트엔 useCallback 불필요
//    → useCallback이 진짜 필요한 순간: dispatch를 감싼 헬퍼를 props로 내려줄 때
//    → 그 시연은 10번(React.memo + props)에서 완성

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
