'use client'

// ═══════════════════════════════════════════════════════════════
// 09번: useMemo — 값 메모이제이션
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. useMemo가 실제로 이 컴포넌트에서 보이나?
//      → 직접적으로 보이지 않음 — context.tsx 내부에 있음
//      → 이 파일은 "useMemo가 잘 적용된 context를 사용하는 법" 시연
//
//   2. context value를 useMemo로 감싸는 이유?
//      → value 객체가 매 렌더마다 새로 생성되면 모든 구독 컴포넌트 리렌더
//      → useMemo로 의존 값이 안 바뀌면 동일 참조 유지
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useMemo를 언제 쓰면 안 되나요?"
//   A: "단순한 계산(배열 10개 filter 등)엔 오히려 느립니다.
//       React DevTools Profiler로 실측 후 적용하는 게 원칙입니다."
//
// ← 08번: useCallback으로 함수 참조 안정화
// ← 09번: useMemo로 파생 데이터 + context value 안정화
//
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider, useTodoState, useTodoDispatch } from './context'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

function ToggleAll() {
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
          <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-bold text-sky-700">
            09
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useMemo — 값 메모이제이션</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          filteredTodos · activeCount · context value를 useMemo로 안정화
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-sky-50 p-4 text-xs text-sky-800 space-y-1">
        <p className="font-semibold">useMemo 핵심 (context.tsx 참고):</p>
        <p>① filteredTodos = useMemo(..., [todos, filter]) — 필요할 때만 재계산</p>
        <p>② activeCount = useMemo(..., [todos]) — filter 바뀌어도 재계산 없음</p>
        <p>③ stateValue = useMemo(...) — context value 객체 참조 안정화</p>
        <p className="text-sky-600 font-medium mt-1">→ 10번에서 React.memo와 조합해 리렌더 완전 차단</p>
      </div>

      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </div>
  )
}
