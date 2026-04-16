'use client'

// ═══════════════════════════════════════════════════════════════
// 02번: useReducer
// ═══════════════════════════════════════════════════════════════
//
// 이전 버전: 01번 (useState)
// 이번 버전: useState → useReducer로 상태 관리 방식 변경
//
// ── 실무 개발 순서 ──────────────────────────────────────────────
//
//   🔴 Step 1: types.ts  완료 (TodoAction 유니온 타입)
//   🟡 Step 2: reducer.ts 완료 (todoReducer 순수함수)
//   🟢 Step 3: page.tsx  ← 지금 여기 (useReducer로 배선)
//
//   이 단계에서 할 일:
//     1. useReducer 선언 (useState 교체)
//     2. 각 setState 호출 → dispatch({ type: ... }) 로 교체
//     3. JSX는 01번과 동일 (변경 없음)
//
// ── useState vs useReducer 선택 기준 (면접 단골 질문) ──────────
//
//   useState  → 단순한 값 (count, isOpen, text)
//   useReducer → 이럴 때 고려:
//     ① 액션 종류가 많고 각각 다른 로직 (여기서: 6가지 액션)
//     ② 다음 상태가 이전 상태에 복잡하게 의존 (TOGGLE_ALL처럼)
//     ③ 상태 변경 로직을 컴포넌트 밖에서 테스트하고 싶을 때
//     ④ 나중에 Context나 전역 상태로 확장 예정일 때
//
// ── 이 버전의 한계 (다음 버전에서 해결) ─────────────────────────
//    - dispatch가 이 컴포넌트 안에만 있음
//    - 자식에게 전달하려면 prop drilling 발생
//    - 03번: useContext로 dispatch를 전역 공유
//
// ═══════════════════════════════════════════════════════════════

import { useReducer, useState } from 'react'
import Link from 'next/link'
import type { Todo, FilterType } from './types'
import { todoReducer } from './reducer'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

export default function TodoPage() {
  // ── 상태 선언 ──────────────────────────────────────────────
  //
  // ← 01번: const [todos, setTodos] = useState<Todo[]>([])
  //
  // useReducer(reducer함수, 초기값) → [현재state, dispatch함수]
  // dispatch를 호출하면 → reducer(현재state, action) 실행 → 새 state → 리렌더
  const [todos, dispatch] = useReducer(todoReducer, [] as Todo[])

  // ← filter는 단순 string → useState가 적합 (reducer 쓸 필요 없음)
  const [filter, setFilter] = useState<FilterType>('all')

  // ── dispatch 래퍼 함수들 ───────────────────────────────────
  //
  // ❓ 왜 dispatch를 직접 prop으로 내리지 않고 래퍼 함수를 쓰는가?
  //   이유 1. 추상화: 자식 컴포넌트가 "dispatch가 있다"는 사실을 몰라도 됨
  //   이유 2. API 안정성: onAdd, onToggle props가 01번과 동일 → 컴포넌트 재사용 가능
  //   이유 3. 유연성: dispatch 방식이 바뀌어도 래퍼만 수정, 컴포넌트는 변경 없음
  //
  // 비교:
  //   ❌ <TodoInput onDispatch={dispatch} />  ← 자식이 action 구조를 알아야 함
  //   ✅ <TodoInput onAdd={addTodo} />        ← 자식은 그냥 text 문자열만 넘김

  function addTodo(text: string): void {
    // ← 01번: const newTodo = { id: crypto.randomUUID(), ... }
    //         setTodos(prev => [newTodo, ...prev])
    dispatch({ type: 'ADD', payload: { text } })
  }

  function toggleTodo(id: string): void {
    // ← 01번: setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    dispatch({ type: 'TOGGLE', payload: { id } })
  }

  function deleteTodo(id: string): void {
    // ← 01번: setTodos(prev => prev.filter(t => t.id !== id))
    dispatch({ type: 'DELETE', payload: { id } })
  }

  function editTodo(id: string, text: string): void {
    // ← 01번: setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
    dispatch({ type: 'EDIT', payload: { id, text } })
  }

  function clearCompleted(): void {
    // ← 01번: setTodos(prev => prev.filter(t => !t.completed))
    dispatch({ type: 'CLEAR_COMPLETED' })
  }

  // ── 파생 데이터 ────────────────────────────────────────────
  // 01번과 동일: todos + filter에서 계산 (상태 아님)
  const filteredTodos: Todo[] = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  // ── 렌더 ───────────────────────────────────────────────────
  // JSX는 01번과 거의 동일.
  // 바뀐 것: TOGGLE_ALL이 dispatch로 직접 호출 (별도 함수 불필요)
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        ← 목록으로
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
            02
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useReducer</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          핵심: 순수함수 reducer, dispatch, Discriminated Union
        </p>
      </div>

      <TodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeCount === 0}
            onChange={() => dispatch({ type: 'TOGGLE_ALL' })}
            id="toggle-all"
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
          />
          <label
            htmlFor="toggle-all"
            className="cursor-pointer text-sm text-gray-600"
          >
            전체 {activeCount === 0 ? '미완료로 변경' : '완료로 변경'}
          </label>
        </div>
      )}

      <div className="mt-4">
        {filteredTodos.length === 0 ? (
          <TodoEmpty
            message={
              filter === 'active'
                ? '진행 중인 할일이 없어요!'
                : filter === 'completed'
                  ? '완료된 할일이 없어요!'
                  : '할일을 추가해보세요!'
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="mt-4">
          <TodoFooter
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        </div>
      )}
    </div>
  )
}
