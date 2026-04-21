'use client'

// ═══════════════════════════════════════════════════════════════
// 03번: useContext + useState — Context 정의
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일이 하는 일 ───────────────────────────────────────────
//
//   1. TodoContextValue 타입 정의 (Context에 담길 값의 형태)
//   2. TodoContext 생성 (createContext)
//   3. TodoProvider 컴포넌트 (useState + 함수들 + Provider)
//   4. useTodoContext 커스텀 훅 (null 체크 포함)
//
// ── 02번과의 핵심 차이 ──────────────────────────────────────────
//
//   02번 page.tsx:
//     const [todos, setTodos] = useState<Todo[]>([])  ← page 안에 있음
//     function addTodo(...) { setTodos(...) }
//     return <TodoInput onAdd={addTodo} />    
//          ← props로 내림
//
//   03번 context.tsx:
//     const [todos, setTodos] = useState<Todo[]>([])  ← Provider 안으로 이동
//     function addTodo(...) { setTodos(...) }
//     return <TodoContext.Provider value={{ todos, addTodo, ... }}>
//
//   03번 page.tsx:
//     return <TodoProvider><TodoInput /></TodoProvider>  ← props 없음!
//
//   03번 TodoInput.tsx:
//     const { addTodo } = useTodoContext()             ← 직접 꺼내 씀
//
// ── prop drilling이란? ──────────────────────────────────────────
//
//   부모 → 자식 → 손자 → 증손자로 props를 계속 내려주는 것.
//   중간 컴포넌트가 실제로 쓰지 않는 props를 그냥 통과시켜야 함.
//   → 컴포넌트가 많아질수록 유지보수 지옥
//
//   Context는 Provider 아래 어디서든 직접 꺼내 쓸 수 있어서 해결됨.
//
// ── createContext(null) 왜 null? ────────────────────────────────
//
//   Context의 기본값 (Provider 없이 useContext 할 때 반환되는 값).
//   null로 잡아두면 useTodoContext에서 null 체크로 실수 방지 가능.
//
//   ❌ createContext({} as TodoContextValue) → 빈 객체라 에러 안 남
//   ✅ createContext(null) + null 체크 → Provider 빠뜨리면 즉시 에러
//
// ── Context 리렌더 주의사항 ─────────────────────────────────────
//
//   value={{ todos, addTodo, ... }} 는 렌더마다 새 객체 생성.
//   → Provider 아래 모든 컴포넌트가 매번 리렌더될 수 있음.
//   → 04번(useReducer+Context)에서 dispatch를 분리해 개선 예정.
//   → 지금 단계에서는 이 정도로 충분.
//
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Todo, FilterType } from './types'

// ── 1. Context에 담길 값의 타입 ────────────────────────────────
interface TodoContextValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]
  activeCount: number
  completedCount: number
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string) => void
  clearCompleted: () => void
  toggleAll: () => void
  setFilter: (filter: FilterType) => void
}

// ── 2. Context 생성 ────────────────────────────────────────────
//
// null: Provider 없이 useContext하면 null → useTodoContext에서 감지
const TodoContext = createContext<TodoContextValue | null>(null)

// ── 3. TodoProvider ────────────────────────────────────────────
//
// 상태와 함수들을 모두 여기서 관리.
// page.tsx는 이 Provider로 감싸기만 하면 됨.
export function TodoProvider({ children }: { children: ReactNode }) {
  // ← 02번: page.tsx 안에 있던 상태들이 여기로 이동
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')

  // ← 02번: page.tsx 안에 있던 함수들이 여기로 이동
  function addTodo(text: string): void {
    setTodos(prev => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ])
  }

  function toggleTodo(id: string): void {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: string): void {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function editTodo(id: string, text: string): void {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text } : t))
    )
  }

  function clearCompleted(): void {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function toggleAll(): void {
    const shouldComplete = todos.some(t => !t.completed)
    setTodos(prev => prev.map(t => ({ ...t, completed: shouldComplete })))
  }

  // ── 파생 데이터 ──────────────────────────────────────────────
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <TodoContext.Provider
      value={{
        todos,
        filter,
        filteredTodos,
        activeCount,
        completedCount,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        clearCompleted,
        toggleAll,
        setFilter,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

// ── 4. useTodoContext 커스텀 훅 ────────────────────────────────
//
// useContext(TodoContext) 를 직접 쓰면 null 체크를 매번 해야 함.
// 커스텀 훅으로 감싸면 null 체크를 한 곳에서만 하면 됨.
//
// → 면접 포인트: "Context 커스텀 훅 왜 만드나요?"
//   "Provider 없이 사용하면 즉시 에러로 알려주기 위해서입니다."
export function useTodoContext(): TodoContextValue {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodoContext는 TodoProvider 안에서만 사용할 수 있습니다')
  return ctx
}
