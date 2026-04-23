'use client'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?          → todos, filteredTodos, 카운트, filter, searchQuery
//   2. 어떤 상태가 바뀌나?               → todos(CRUD), filter, searchQuery(디바운스)
//   3. 그 상태를 바꾸는 함수는?          → dispatch + setSearchQuery
//   4. 타입을 어떻게 정의했나?           → 04번 StateValue + searchQuery/setSearchQuery 추가
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → TodoSearch만 searchQuery 필요 → StateContext에 포함
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useEffect deps 배열이 왜 중요한가요?"
//   A: "deps가 바뀔 때만 effect가 실행됩니다.
//       [] → 마운트 한 번만 (초기 로드),
//       [state.todos] → todos 바뀔 때마다 (저장),
//       [rawQuery] + clearTimeout → 마지막 입력 후 300ms에만 (디바운스)."
//
//   Q: "디바운스에서 클린업이 왜 필요한가요?"
//   A: "사용자가 빠르게 타이핑할 때마다 setTimeout이 쌓입니다.
//       클린업(clearTimeout)으로 이전 타이머를 취소해야
//       마지막 입력 후 300ms에 딱 한 번만 실행됩니다."
//
// ── useEffect 3가지 패턴 ────────────────────────────────────────
// 1. localStorage 저장/불러오기
// 2. document.title 업데이트
// 3. 검색어 디바운스 (rawQuery → debouncedQuery)
// ───────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

const STORAGE_KEY = 'todo-05'

interface TodoStateValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]
  activeCount: number
  completedCount: number
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const TodoStateContext = createContext<TodoStateValue | null>(null)
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // ── useEffect 1: localStorage에서 초기 데이터 불러오기 ──────
  // 빈 deps [] → 마운트 시 한 번만 실행
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'LOAD', todos: JSON.parse(raw) })
    } catch {
      // JSON 파싱 실패 시 무시
    }
  }, [])

  // ── useEffect 2: todos 바뀔 때마다 localStorage에 저장 ──────
  // state.todos가 deps → todos 변경 시마다 실행
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
  }, [state.todos])

  // ── useEffect 3: document.title 업데이트 ────────────────────
  const activeCount = state.todos.filter(t => !t.completed).length
  useEffect(() => {
    document.title = activeCount > 0 ? `(${activeCount}) Todo 05` : 'Todo 05'
  }, [activeCount])

  // ── 검색어 디바운스 ──────────────────────────────────────────
  // rawQuery: 즉시 반영 (input에 표시)
  // debouncedQuery: 300ms 후 반영 (필터링에 사용)
  const [rawQuery, setRawQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(rawQuery), 300)
    return () => clearTimeout(timer) // 클린업: 이전 타이머 취소
  }, [rawQuery])

  const completedCount = state.todos.filter(t => t.completed).length

  const filteredTodos = state.todos.filter(todo => {
    const matchesFilter =
      state.filter === 'active' ? !todo.completed :
      state.filter === 'completed' ? todo.completed : true
    const matchesSearch = todo.text.toLowerCase().includes(debouncedQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stateValue: TodoStateValue = {
    todos: state.todos,
    filter: state.filter,
    filteredTodos,
    activeCount,
    completedCount,
    searchQuery: rawQuery,
    setSearchQuery: setRawQuery,
  }

  return (
    <TodoStateContext.Provider value={stateValue}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  )
}

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
