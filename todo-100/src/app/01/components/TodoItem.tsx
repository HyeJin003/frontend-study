'use client'

// ─────────────────────────────────────────────────────────────
// TodoItem: 개별 Todo 항목
//
// 이 컴포넌트가 하는 일:
//   1. 완료 체크박스
//   2. 텍스트 표시 (더블클릭 시 편집 모드)
//   3. 삭제 버튼
// ─────────────────────────────────────────────────────────────

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
  // 편집 모드 여부
  const [isEditing, setIsEditing] = useState<boolean>(false)
  // 편집 중인 임시 텍스트 (확정 전까지 원본 건드리지 않음)
  const [editText, setEditText] = useState<string>(todo.text)

  function handleEditConfirm(): void {
    const trimmed = editText.trim()
    if (trimmed === '') {
      // 빈 텍스트로 편집하면 삭제와 동일한 효과
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
      // ESC: 편집 취소 → 원본 텍스트 복원
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      {/* 체크박스 */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        // aria-label: 어떤 항목을 완료하는지 스크린 리더에 전달
        aria-label={`${todo.text} 완료 표시`}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />

      {/* 텍스트 or 편집 input */}
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleEditConfirm} // 포커스 잃으면 자동 확정
          // autoFocus: 편집 모드 진입 시 자동으로 포커스
          // (06번 useRef 예제에서 더 정밀하게 제어)
          autoFocus
          maxLength={200}
          className="flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        // ❓ onDoubleClick으로 편집 모드 진입
        //   → 더블클릭은 일반 클릭(완료 토글)과 구분됨
        <span
          onDoubleClick={() => {
            setEditText(todo.text) // 편집 시작 시 현재 텍스트로 초기화
            setIsEditing(true)
          }}
          title="더블클릭하여 편집"
          className={`flex-1 cursor-pointer select-none text-sm ${
            todo.completed
              ? 'text-gray-400 line-through' // 완료: 취소선 + 흐린 색
              : 'text-gray-800'
          }`}
        >
          {todo.text}
        </span>
      )}

      {/* 삭제 버튼 */}
      <button
        onClick={() => onDelete(todo.id)}
        // aria-label: 어떤 항목을 삭제하는지 스크린 리더에 전달
        aria-label={`${todo.text} 삭제`}
        className="shrink-0 rounded p-1 text-gray-400
          transition-colors hover:bg-red-50 hover:text-red-500
          focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        {/* SVG 아이콘: img 태그 없이 inline SVG → 색상 제어 쉬움 */}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
