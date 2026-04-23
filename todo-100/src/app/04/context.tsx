'use client'

// ═══════════════════════════════════════════════════════════════
// 04번: useContext + useReducer — Context 정의
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일이 하는 일 ───────────────────────────────────────────
//
//   1. TodoStateContext  — 상태(읽기 전용) 공급
//   2. TodoDispatchContext — dispatch(쓰기) 공급
//   3. TodoProvider — useReducer로 두 Context를 동시에 공급
//   4. useTodoState / useTodoDispatc  h — 각각의 커스텀 훅
//
// ── 03번과의 핵심 차이 ──────────────────────────────────────────
//
//   03번:
//     Context 하나에 { todos, addTodo, toggleTodo, ... } 다 넣음
//     → todos 바뀌면 addTodo만 쓰는 컴포넌트도 리렌더
//
//   04번:
//     StateContext  → { todos, filter, filteredTodos, ... }  (상태)
//     DispatchContext → dispatch  (함수, 절대 안 바뀜)
//     → dispatch만 쓰는 컴포넌트는 todos 바뀌어도 리렌더 안 됨!
//
// ── 왜 dispatch는 리렌더를 안 일으키나? ────────────────────────
//
//   useReducer의 dispatch는 컴포넌트 생애주기 동안 동일한 참조 유지.
//   → DispatchContext value가 바뀌지 않음 → 구독 컴포넌트 리렌더 없음.             
//
// ── 면접 포인트 ─────────────────────────────────────────────────
//
//   Q: "Context를 왜 두 개로 나눴나요?"
//   A: "상태와 dispatch를 분리하면 dispatch만 쓰는 컴포넌트가
//       상태 변경에 의해 불필요하게 리렌더되는 것을 방지할 수 있습니다."
//
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

// ── 1. 상태 Context에 담길 타입 ───────────────────────────────
interface TodoStateValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]
  activeCount: number
  completedCount: number
}

// ── 2. 두 개의 Context 생성 ────────────────────────────────────
const TodoStateContext = createContext<TodoStateValue | null>(null)
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null)

// ── 3. TodoProvider ────────────────────────────────────────────
export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // 파생 데이터 계산
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed
    if (state.filter === 'completed') return todo.completed
    return true
  })
  const activeCount = state.todos.filter(t => !t.completed).length
  const completedCount = state.todos.filter(t => t.completed).length

  const stateValue: TodoStateValue = {
    todos: state.todos,
    filter: state.filter,
    filteredTodos,
    activeCount,
    completedCount,
  }

  // ← 핵심: StateContext와 DispatchContext를 따로 공급
  return (
    <TodoStateContext.Provider value={stateValue}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  )
}

// ── 4. 커스텀 훅 두 개 ────────────────────────────────────────
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
