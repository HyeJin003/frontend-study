'use client'

// ═══════════════════════════════════════════════════════════════
// 09번: useMemo — 값 메모이제이션
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?          → todos, filteredTodos, 카운트
//   2. 어떤 값이 비용이 드는 연산인가?   → filteredTodos, activeCount, completedCount
//   3. 언제 재계산이 필요한가?           → todos나 filter가 바뀔 때만
//   4. 08번과 차이점?                    → 파생 데이터를 useMemo로 감쌈
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useMemo를 무조건 쓰는 게 좋지 않나요?"
//   A: "아닙니다. useMemo 자체도 비교 연산 비용이 있습니다.
//       배열 10개 filter는 useMemo가 오히려 느릴 수 있습니다.
//       진짜 비용이 큰 계산(정렬, 집계, 파생 데이터)에만 써야 합니다.
//       React DevTools Profiler로 실측 후 적용하는 게 원칙입니다."
//
// ── useMemo가 의미 있는 케이스 ──────────────────────────────────
//
//   ① 비용이 큰 파생 데이터:
//     todos가 1000개이고 filter/sort가 복잡할 때
//   ② Context value 안정화:
//     context value 객체가 매 렌더마다 새로 생성되면
//     모든 구독 컴포넌트가 리렌더됨 → useMemo로 안정화
//
// ← 08번: useCallback으로 함수 안정화
// ← 09번: useMemo로 파생 데이터(filteredTodos, 카운트) 안정화
//
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useMemo, useReducer, useCallback, useEffect, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

const STORAGE_KEY = 'todo-09'

interface TodoStateValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]        // ← useMemo로 메모이제이션
  activeCount: number          // ← useMemo로 메모이제이션
  completedCount: number       // ← useMemo로 메모이제이션
  setFilter: (f: FilterType) => void
}

const TodoStateContext = createContext<TodoStateValue | null>(null)
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  // ── localStorage: 로드 ────────────────────────────────────────
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

  // ── localStorage: 저장 ────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    } catch {
      // 저장 실패 무시
    }
  }, [state.todos, isLoaded])

  // ── useMemo: 파생 데이터 메모이제이션 ─────────────────────────
  //
  // ❌ useMemo 없이: 부모 어딘가에서 리렌더 발생하면 매번 재계산
  // ✅ useMemo 있으면: state.todos나 filter가 바뀔 때만 재계산
  //
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return state.todos.filter(t => !t.completed)
    if (filter === 'completed') return state.todos.filter(t => t.completed)
    return state.todos
  }, [state.todos, filter])

  // deps: [state.todos] — filter 바뀌어도 activeCount는 재계산 불필요
  const activeCount = useMemo(
    () => state.todos.filter(t => !t.completed).length,
    [state.todos]
  )

  const completedCount = useMemo(
    () => state.todos.filter(t => t.completed).length,
    [state.todos]
  )

  // ── useCallback: setFilter 안정화 ────────────────────────────
  const setFilterCallback = useCallback((f: FilterType) => {
    setFilter(f)
  }, [])

  // ── Context value도 useMemo로 안정화 ─────────────────────────
  // value 객체가 매 렌더마다 새로 생성되면 모든 구독 컴포넌트 리렌더
  // → 의존 값들이 바뀔 때만 새 객체 생성
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
