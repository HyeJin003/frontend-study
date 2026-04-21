'use client'

// ═══════════════════════════════════════════════════════════════
// 03번 연습: Context 정의
// 📖 정답: todo-100/src/app/03/context.tsx
// ═══════════════════════════════════════════════════════════════
//
// 🟡 Step 2: types.ts 완성 후 이 파일을 작성하세요
//
// ❓ 생각해보기:
//   - prop drilling이 뭔가요? 왜 문제인가요?
//   - createContext(null) 왜 null로 초기화하나요?
//   - useTodoContext에서 null 체크를 왜 하나요?
//
// 작성 순서:
//   1. TodoContextValue 인터페이스 정의
//   2. TodoContext = createContext<TodoContextValue | null>(null)
//   3. TodoProvider 컴포넌트 (useState + 함수들 + Provider)
//   4. useTodoContext 커스텀 훅 (null 체크 포함)
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Todo, FilterType } from './types'

// TODO [Step 2-A]: TodoContextValue 인터페이스를 정의하세요
//   todos, filter, filteredTodos, activeCount, completedCount
//   addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, toggleAll, setFilter
interface TodoContextValue {
  
  todos:Todo[]
  filter:FilterType
  filterTodos:Todo[]
  activeCount:number
  completedCount:number
  addTodo: (text:string) => void
  toggleTodo:(id:string)  => void
  editTodo:(id:string , text:string) =>void
  clearCompleted : () =>void
  toggleAll:()=>void
  setFilter:(filter:FilterType) => void
}

// TODO [Step 2-B]: Context를 생성하세요
// 힌트: createContext<TodoContextValue | null>(null)
const TodoContext = createContext<TodoContextValue | null>(null)

// TODO [Step 2-C]: TodoProvider를 구현하세요
// 02번 page.tsx에 있던 상태와 함수들을 여기로 옮기면 됩니다
// stub: 구현 전까지 빈 값으로 에러 없이 렌더되게 함
const stubValue: TodoContextValue = {
  todos: [], filter: 'all', filteredTodos: [], activeCount: 0, completedCount: 0,
  addTodo: (text:string) => void, toggleTodo: () => {}, deleteTodo: () => {}, editTodo: () => {},
  clearCompleted: () => {}, toggleAll: () => {}, setFilter: () => {},
}

export function TodoProvider({ children }: { children: ReactNode }) {
  // 여기에 작성 (stub이 있어서 일단 화면은 뜸)
  return <TodoContext.Provider value={stubValue}>{children}</TodoContext.Provider>
}

// TODO [Step 2-D]: useTodoContext 커스텀 훅을 만드세요
// 힌트: useContext(TodoContext) → null 체크 → return ctx
export function useTodoContext(): TodoContextValue {
  // 여기에 작성
  return useContext(TodoContext) ?? stubValue
}
