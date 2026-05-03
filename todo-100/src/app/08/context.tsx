'use client'

// ─────────────────────────────────────────────────────────────
// 📗 챕터 4 — 메모이제이션 (08~10번)
// 공통 규칙(파일 읽는 순서/주석 읽는 법/컴포넌트 설계) → 01번 page.tsx 상단 참고
// ─────────────────────────────────────────────────────────────
//
// 이 챕터 읽는 순서:
//   08번: types.ts → reducer.ts → context.tsx → page.tsx → components/
//   09번: types.ts → reducer.ts → context.tsx → page.tsx → components/
//   10번: types.ts → reducer.ts → context.tsx → page.tsx → components/
//
// 이 챕터 React 문서:
//   react.dev/reference/react/useCallback
//   react.dev/reference/react/useMemo
//   react.dev/reference/react/memo → "Deep Dive: Should you add memo everywhere?" 필독
//
// 이 챕터에서 생각해볼 것:
//   - "useCallback 단독으로 리렌더를 막을 수 있나?"
//     → 10번 components/TodoItem.tsx의 렌더 카운터(×N)로 직접 확인
//   - "useMemo와 useCallback의 차이?"
//     → useMemo: 값 메모이제이션 / useCallback: 함수 메모이제이션
//     → useCallback(fn, deps) === useMemo(() => fn, deps)
//   - "React.memo가 효과 없는 경우는?"
//     → props로 새 함수/객체를 매 렌더마다 생성해 넘길 때
//     → 해결: useCallback(함수) + useMemo(객체)로 참조 안정화
//   - 09번 context.tsx: activeCount deps가 왜 [state.todos]만인가?
//     → filter가 바뀌어도 activeCount는 재계산 불필요
//   - 10번 page.tsx: handleCommitEdit deps가 왜 [dispatch]만인가?
//     → editText를 파라미터로 받아 deps 최소화 → 참조 안정
//
// ═══════════════════════════════════════════════════════════════
// 08번: useCallback — 함수 메모이제이션
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?          → todos, filteredTodos, 카운트, filter
//   2. 어떤 상태가 바뀌나?               → ADD/TOGGLE/DELETE 등 → dispatch 위임
//   3. 그 상태를 바꾸는 함수는?          → dispatch 직접, 또는 useCallback 헬퍼 함수
//   4. 타입을 어떻게 정의했나?           → StateValue(읽기) + dispatch(쓰기) 분리
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → 상태 Context or dispatch Context 구독
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useCallback이 실제로 리렌더를 방지하나요?"
//   A: "useCallback 단독으로는 방지하지 못합니다.
//       부모가 리렌더되면 자식도 리렌더됩니다.
//       useCallback으로 함수 참조를 안정화하고,
//       자식 컴포넌트를 React.memo로 감싸야 비로소 리렌더가 방지됩니다.
//       즉, useCallback은 React.memo와 함께 쓸 때 의미가 있습니다."
//
// ── ⚠️ 핵심 주의사항 ─────────────────────────────────────────────
//
//   useCallback 단독 → 리렌더 방지 ❌
//   useCallback + React.memo → 리렌더 방지 ✅ (10번에서 완성)
//
//   dispatch 자체는 이미 안정적 참조 (useReducer가 보장)
//   → dispatch를 직접 내려주는 건 useCallback 불필요
//   → dispatch를 감싸는 헬퍼(addTodo, toggleTodo 등)에 useCallback 적용
//
// ← 07번: useEffect로 localStorage 연동
// ← 08번: useCallback으로 함수 참조 안정화 (React.memo를 위한 준비)
//
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

const STORAGE_KEY = 'todo-08'

// ── 1. 상태 Context 타입 ──────────────────────────────────────
interface TodoStateValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]
  activeCount: number
  completedCount: number
  setFilter: (f: FilterType) => void  // ← useCallback으로 안정화된 setter
}

// ── 2. 두 개의 Context (← 04번 패턴 유지) ────────────────────
const TodoStateContext = createContext<TodoStateValue | null>(null)
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null)

// ── 3. TodoProvider ────────────────────────────────────────────
export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  // ── localStorage: 로드 (← 07번 패턴) ───────────────────────
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

  // ── localStorage: 저장 (← 07번 패턴) ───────────────────────
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    } catch {
      // 저장 실패 무시
    }
  }, [state.todos, isLoaded])

  // ── useCallback 예시: dispatch 감싸는 헬퍼 함수들 ────────────
  //
  // 왜 useCallback을 쓰나?
  //   이 함수들을 React.memo 자식에게 props로 넘길 때,
  //   부모(TodoProvider) 리렌더마다 새 함수 참조가 생기면
  //   memo가 "props 바뀜"으로 판단해 자식도 리렌더됨.
  //   useCallback으로 deps가 같으면 동일 참조 유지 → memo 효과 발휘.
  //
  // dispatch 자체는 useCallback 불필요 (이미 안정적 참조)
  const setFilterCallback = useCallback((f: FilterType) => {
    setFilter(f)
  }, []) // setFilter는 stable → deps 빈 배열

  // Context 사용 패턴:
  //   setFilterCallback은 StateContext에 넣지 않고
  //   DispatchContext처럼 별도 Context로 분리하는 게 이상적.
  //   여기서는 개념 설명용으로 StateValue에 포함.
  //   (실무에서는 dispatch만 DispatchContext에 노출)

  // ── 파생 데이터 ──────────────────────────────────────────────
  const filteredTodos = state.todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })
  const activeCount = state.todos.filter(t => !t.completed).length
  const completedCount = state.todos.filter(t => t.completed).length

  const stateValue: TodoStateValue = {
    todos: state.todos,
    filter,
    filteredTodos,
    activeCount,
    completedCount,
    setFilter: setFilterCallback,  // ← useCallback 버전 노출
  }

  return (
    <TodoStateContext.Provider value={stateValue}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  )
}

// ── 4. 커스텀 훅 ──────────────────────────────────────────────
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
