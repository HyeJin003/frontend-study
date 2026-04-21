'use client'

// ✋ 03b 안보고 치기: TodoItem을 직접 구현하세요
// todo prop만 받고, toggleTodo/deleteTodo/editTodo는 useTodoContext()에서 꺼내 쓰세요

import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  return <div>TODO: {todo.text}</div>
}
