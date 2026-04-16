'use client'

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
      <Button onClick={handleAdd} disabled={text.trim() === ''} size="md">
        추가
      </Button>
    </div>
  )
}
