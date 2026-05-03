'use client'

// ═══════════════════════════════════════════════════════════════
// 08번: useCallback — 함수 메모이제이션
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. useCallback은 어디에 써야 하나?
//      → context 안의 setFilterCallback (setFilter를 stable하게 노출)
//      → 자식에게 함수를 props로 내려줄 때 (10번에서 완성)
//
//   2. 자식 컴포넌트가 context를 직접 구독하면?
//      → dispatch는 이미 stable (useReducer 보장)
//      → context 값이 바뀔 때 구독 컴포넌트 모두 리렌더
//      → useCallback만으로는 리렌더 방지 불가 → React.memo 필요
//
//   3. useCallback 단독의 한계
//      → useCallback은 "함수 참조 안정화"만 담당
//      → 자식 컴포넌트가 memo로 감싸져 있어야 비로소 리렌더 방지
//      → 10번에서 useCallback + React.memo 조합 완성
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useCallback을 언제 써야 하나요?"
//   A: "React.memo로 최적화된 자식에게 함수를 props로 넘길 때입니다.
//       단독 사용은 메모리만 씁니다."
//
// ← 07번: useEffect 기반 훅 (useLocalStorage, useDocumentTitle)
// ← 08번: useCallback으로 함수 참조 안정화 (10번 React.memo와 조합 예정)
//
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider, useTodoState, useTodoDispatch } from './context'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

function ToggleAll() {
  // dispatch만 구독 → 상태 바뀌어도 리렌더 없음 (DispatchContext만 읽음)
  const dispatch = useTodoDispatch()
  const { activeCount } = useTodoState()

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="toggle-all"
        checked={activeCount === 0}
        onChange={() => dispatch({ type: 'TOGGLE_ALL' })}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />
      <label htmlFor="toggle-all" className="cursor-pointer text-sm text-gray-600">
        전체 {activeCount === 0 ? '미완료로 변경' : '완료로 변경'}
      </label>
    </div>
  )
}

function TodoContent() {
  const { todos, filteredTodos } = useTodoState()

  return (
    <>
      <TodoInput />

      {todos.length > 0 && (
        <div className="mt-4">
          <ToggleAll />
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
          <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
            08
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useCallback — 함수 메모이제이션</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          dispatch 헬퍼 안정화 · context의 setFilter를 useCallback으로 노출
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-amber-50 p-4 text-xs text-amber-800 space-y-1">
        <p className="font-semibold">useCallback 핵심:</p>
        <p>① dispatch 자체 → useCallback 불필요 (useReducer가 이미 stable 보장)</p>
        <p>② setFilter → useCallback으로 감싸서 context value에 노출</p>
        <p>③ useCallback 단독 → 리렌더 방지 ❌ (React.memo와 함께 써야 ✅)</p>
        <p className="text-amber-600 font-medium mt-1">→ 10번에서 useCallback + React.memo 조합 완성</p>
      </div>

      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </div>
  )
}
