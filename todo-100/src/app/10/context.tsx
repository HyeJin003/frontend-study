'use client'

// ═══════════════════════════════════════════════════════════════
// 10번: React.memo — 컴포넌트 메모이제이션
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   Context 구조는 09번과 동일.
//   핵심 변화: page.tsx에서 자식 컴포넌트를 React.memo로 감싸고
//             부모가 리렌더될 때 자식이 스킵되는 걸 렌더 카운터로 확인.
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "React.memo, useCallback, useMemo를 함께 쓰는 이유가 뭔가요?"
//   A: "세 가지가 각자 역할이 다릅니다.
//       useMemo   → 값의 참조 안정화 (객체/배열 재생성 방지)
//       useCallback → 함수의 참조 안정화 (함수 재생성 방지)
//       React.memo → 컴포넌트 리렌더 방지 (props 변경 없으면 스킵)
//       React.memo만 있어도 props로 새 함수/객체를 넘기면 효과 없어서,
//       세 가지를 함께 써야 진짜 최적화가 됩니다."
//
// ← 09번: useMemo로 파생 데이터 안정화
// ← 10번: React.memo로 컴포넌트 메모이제이션 (08+09 조합 완성)
//
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useMemo, useReducer, useCallback, useEffect, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

const STORAGE_KEY = 'todo-10'

interface TodoStateValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]
  activeCount: number
  completedCount: number
  setFilter: (f: FilterType) => void
}

const TodoStateContext = createContext<TodoStateValue | null>(null)
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Todo[]
        dispatch({ type: 'LOAD', todos: parsed })
      }
    } catch {
      // 파싱 실패 무시
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    } catch {
      // 저장 실패 무시
    }
  }, [state.todos, isLoaded])

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return state.todos.filter(t => !t.completed)
    if (filter === 'completed') return state.todos.filter(t => t.completed)
    return state.todos
  }, [state.todos, filter])

  const activeCount = useMemo(
    () => state.todos.filter(t => !t.completed).length,
    [state.todos]
  )

  const completedCount = useMemo(
    () => state.todos.filter(t => t.completed).length,
    [state.todos]
  )

  const setFilterCallback = useCallback((f: FilterType) => {
    setFilter(f)
  }, [])

  const stateValue = useMemo<TodoStateValue>(() => ({
    todos: state.todos,
    filter,
    filteredTodos,
    activeCount,
    completedCount,
    setFilter: setFilterCallback,
  }), [state.todos, filter, filteredTodos, activeCount, completedCount, setFilterCallback])

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
