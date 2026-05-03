'use client'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, 검색창, 필터, 미완료 개수
//   2. 어떤 상태가 바뀌나?          → 전부 context 위임 (todos, filter, searchQuery)
//   3. 그 상태를 바꾸는 함수는?     → context의 dispatch + setSearchQuery
//   4. 타입을 어떻게 정의했나?      → context.tsx에서 관리 (page는 consume만)
//   5. 자식 컴포넌트들이 뭘 필요로 하나?
//      TodoInput   → dispatch만 (ADD 액션)
//      TodoSearch  → searchQuery + setSearchQuery (context 직접 구독)
//      TodoItem    → todo + dispatch
//      TodoEmpty   → filter
//      TodoFooter  → activeCount + completedCount + filter + setFilter + clearCompleted
//
//   ── 04번 대비 변화 ──────────────────────────────────────────
//   - TodoSearch 컴포넌트 추가 (검색어 입력, 디바운스는 context useEffect에서 처리)
//   - localStorage 영속성 (새로고침해도 유지)
//   - document.title에 미완료 개수 표시
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useEffect 클린업 함수는 언제 실행되나요?"
//   A: "① deps가 바뀌어 effect가 재실행되기 직전
//       ② 컴포넌트가 언마운트될 때
//       두 경우 모두 이전 effect의 클린업이 먼저 실행됩니다.
//       디바운스에서 clearTimeout이 필요한 이유입니다."
//
// ← 04번: useContext + useReducer (State/Dispatch 분리)
// ← 05번: useEffect 심화 (localStorage + document.title + 검색 디바운스)
//
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider, useTodoState, useTodoDispatch } from './context'
import TodoInput from './components/TodoInput'
import TodoSearch from './components/TodoSearch'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

function TodoContent() {
  const { todos, filteredTodos, activeCount } = useTodoState()

  return (
    <>
      <TodoInput />

      <div className="mt-3">
        <TodoSearch />
      </div>

      {todos.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <ToggleAllCheckbox activeCount={activeCount} />
        </div>
      )}

      <div className="mt-4">
        {filteredTodos.length === 0 ? (
          <TodoEmpty />
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="mt-4">
          <TodoFooter />
        </div>
      )}
    </>
  )
}

function ToggleAllCheckbox({ activeCount }: { activeCount: number }) {
  const dispatch = useTodoDispatch()
  return (
    <>
      <input
        type="checkbox"
        checked={activeCount === 0}
        onChange={() => dispatch({ type: 'TOGGLE_ALL' })}
        id="toggle-all"
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />
      <label htmlFor="toggle-all" className="cursor-pointer text-sm text-gray-600">
        전체 {activeCount === 0 ? '미완료로 변경' : '완료로 변경'}
      </label>
    </>
  )
}

export default function TodoPage() {
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
          <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
            05
          </span>
          <h1 className="text-2xl font-bold text-gray-900">
            useEffect — localStorage + 검색 디바운스
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          새로고침해도 데이터 유지 · 탭 제목 업데이트 · 검색 디바운스
        </p>
      </div>

      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </div>
  )
}
