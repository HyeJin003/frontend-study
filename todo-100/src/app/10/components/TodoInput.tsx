'use client'

// ← 10번: React.memo + useCallback 조합
//
// memo(TodoInput): value/onChange/onAdd props가 바뀌지 않으면 리렌더 스킵
// 부모(TodoContent)가 다른 이유로 리렌더돼도 이 컴포넌트는 스킵됨
//
// 렌더 카운터(×N): 타이핑 중 이 숫자가 오르면 memo가 작동 안 하는 것
// → onChange prop이 useCallback으로 감싸져야 stable 참조 유지

import { memo, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  value: string
  onChange: (text: string) => void
  onAdd: () => void
}

const TodoInput = memo(function TodoInput({ value, onChange, onAdd }: Props) {
  const renderCount = useRef(0)
  renderCount.current += 1

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) onAdd()
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="할 일을 입력하세요"
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
          placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <span className="self-center text-xs text-gray-300 tabular-nums">×{renderCount.current}</span>
      <Button onClick={onAdd} disabled={!value.trim()}>추가</Button>
    </div>
  )
})

export default TodoInput
