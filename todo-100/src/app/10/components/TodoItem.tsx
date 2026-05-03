'use client'

// ← 10번: React.memo + useCallback 조합의 핵심
//
// 타이핑 중 다른 TodoItem의 ×숫자가 오르지 않아야 memo 작동 중인 것
// → onToggle/onDelete 등이 useCallback으로 감싸져야 stable 참조 유지
//
// isEditing인 항목만 editText prop이 바뀌므로 그 항목만 리렌더됨 (정상)

import { memo, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'
import Button from '@/components/ui/Button'

interface Props {
  todo: Todo
  isEditing: boolean
  editText: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onStartEdit: (id: string, text: string) => void
  onCommitEdit: (id: string, text: string) => void
  onCancelEdit: () => void
  onEditChange: (text: string) => void
}

const TodoItem = memo(function TodoItem({
  todo, isEditing, editText,
  onToggle, onDelete, onStartEdit, onCommitEdit, onCancelEdit, onEditChange,
}: Props) {
  const renderCount = useRef(0)
  renderCount.current += 1

  function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) onCommitEdit(todo.id, editText)
    if (e.key === 'Escape') onCancelEdit()
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={e => onEditChange(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={() => onCommitEdit(todo.id, editText)}
          autoFocus
          className="flex-1 rounded border border-blue-300 px-2 py-0.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <span
          className={`flex-1 cursor-pointer select-none text-sm ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
          onDoubleClick={() => onStartEdit(todo.id, todo.text)}
        >
          {todo.text}
        </span>
      )}
      <span className="text-xs text-gray-300 tabular-nums">×{renderCount.current}</span>
      <Button size="sm" variant="ghost" onClick={() => onStartEdit(todo.id, todo.text)}>수정</Button>
      <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>삭제</Button>
    </li>
  )
})

export default TodoItem
