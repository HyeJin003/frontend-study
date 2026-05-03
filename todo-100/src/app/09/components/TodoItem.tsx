'use client'

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'
import { useTodoDispatch } from '../context'
import Button from '@/components/ui/Button'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useTodoDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function handleEditConfirm() {
    const trimmed = editText.trim()
    if (!trimmed) {
      dispatch({ type: 'DELETE', id: todo.id })
    } else {
      dispatch({ type: 'EDIT', id: todo.id, text: trimmed })
    }
    setIsEditing(false)
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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
          className="flex-1 rounded border border-blue-300 px-2 py-0.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <span
          className={`flex-1 cursor-pointer select-none text-sm ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
          onDoubleClick={() => { setEditText(todo.text); setIsEditing(true) }}
        >
          {todo.text}
        </span>
      )}
      <Button size="sm" variant="ghost" onClick={() => { setEditText(todo.text); setIsEditing(true) }}>수정</Button>
      <Button size="sm" variant="danger" onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>삭제</Button>
    </li>
  )
}
