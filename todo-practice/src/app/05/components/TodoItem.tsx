'use client'

// ─────────────────────────────────────────────────────────────
// TodoItem: 개별 Todo 항목
// 📖 정답: todo-100/src/app/05/components/TodoItem.tsx
//
// TODO [Step 4-C]: 04번과 동일
//   useTodoDispatch() + TOGGLE / DELETE / EDIT
//   isEditing 상태, 더블클릭 편집, ESC/Enter 처리
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'
import { useTodoDispatch } from '../context'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  // 여기에 작성
  return <li />
}
