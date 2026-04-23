'use client'

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'
import { useTodoDispatch } from '../context'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useTodoDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function handleEditConfirm(): void {
    const trimmed = editText.trim()
    if (trimmed === '') {
      dispatch({ type: 'DELETE', id: todo.id })
    } else {
      dispatch({ type: 'EDIT', id: todo.id, text: trimmed })
    }
    setIsEditing(false)
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleEditConfirm()
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
        onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
        aria-label={`${todo.text} 완료 표시`}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleEditConfirm}
          autoFocus
          maxLength={200}
          className="flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span
          onDoubleClick={() => { setEditText(todo.text); setIsEditing(true) }}
          title="더블클릭하여 편집"
          className={`flex-1 cursor-pointer select-none text-sm ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
        aria-label={`${todo.text} 삭제`}
        className="shrink-0 rounded p-1 text-gray-400 transition-colors
          hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
