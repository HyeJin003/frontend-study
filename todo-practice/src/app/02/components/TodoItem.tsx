'use client'

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editText, setEditText] = useState<string>(todo.text)

  function handleEditConfirm(): void {
    const trimmed = editText.trim()
    if (trimmed === '') {
      onDelete(todo.id)
    } else {
      onEdit(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleEditConfirm()
    }
    if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`${todo.text} 완료 표시`}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleEditConfirm}
          autoFocus
          maxLength={200}
          className="flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span
          onDoubleClick={() => {
            setEditText(todo.text)
            setIsEditing(true)
          }}
          title="더블클릭하여 편집"
          className={`flex-1 cursor-pointer select-none text-sm ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`${todo.text} 삭제`}
        className="shrink-0 rounded p-1 text-gray-400
          transition-colors hover:bg-red-50 hover:text-red-500
          focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
