'use client'

// ═══════════════════════════════════════════════════════════════
// 05번 연습: context.tsx
// 📖 정답: todo-100/src/app/05/context.tsx
//
// 🟡 Step 3: reducer.ts 완성 후 작성하세요
//
// ❓ 생각해보기:
//   - useEffect가 총 몇 개 필요한가요?
//   - [] deps와 [state.todos] deps의 차이는?
//   - 디바운스에서 클린업(return)이 필요한 이유는?
//   - searchQuery를 StateContext에 넣는 이유는?
//
// 💡 useEffect 패턴:
//   1. [] deps           → 마운트 시 한 번 (localStorage 불러오기)
//   2. [state.todos]     → todos 바뀔 때마다 (localStorage 저장)
//   3. [activeCount]     → 바뀔 때마다 (document.title)
//   4. [rawQuery] + return () => clearTimeout → 디바운스 (300ms)
//
// 작성 순서:
//   1. TodoStateValue 인터페이스 (searchQuery, setSearchQuery 추가)
//   2. TodoStateContext, TodoDispatchContext 생성
//   3. TodoProvider (useReducer + useEffect 4개 + useState for search)
//   4. useTodoState, useTodoDispatch 커스텀 훅
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

const STORAGE_KEY = 'todo-05'

// TODO [Step 3-A]: TodoStateValue 인터페이스 정의
// 힌트: 04번 + searchQuery: string, setSearchQuery: (q: string) => void
interface TodoStateValue {
  // 여기에 작성
}

// TODO [Step 3-B]: 두 개의 Context 생성
const TodoStateContext = createContext<TodoStateValue | null>(null)
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null)

// TODO [Step 3-C]: TodoProvider 구현
export function TodoProvider({ children }: { children: ReactNode }) {
  // 여기에 작성

  return <>{children}</>
}

// TODO [Step 3-D]: 커스텀 훅 두 개
export function useTodoState(): TodoStateValue {
  const ctx = useContext(TodoStateContext)
  if (!ctx) throw new Error('useTodoState는 TodoProvider 안에서만 사용 가능')
  return ctx
}

export function useTodoDispatch(): Dispatch<TodoAction> {
  const ctx = useContext(TodoDispatchContext)
  if (!ctx) throw new Error('useTodoDispatch는 TodoProvider 안에서만 사용 가능')
  return ctx
}
