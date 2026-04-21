'use client'

// ═══════════════════════════════════════════════════════════════
// 03번: useContext + useState
// ═══════════════════════════════════════════════════════════════
//
// 이전 버전: 02번 (useReducer, props로 함수 전달)
// 이번 버전: Context로 상태를 전역 공유 → prop drilling 해결
//
// ── 실무 개발 순서 ──────────────────────────────────────────────
//
//   🔴 Step 1: types.ts   완료
//   🟡 Step 2: context.tsx 완료 (TodoProvider + useTodoContext)
//   🟢 Step 3: page.tsx   ← 지금 여기 (Provider로 감싸기)
//   🟢 Step 4: components/ (useContext로 직접 꺼내 쓰기)
//
// ── 02번 vs 03번 page.tsx 비교 ─────────────────────────────────
//
//   02번:
//     function addTodo(text) { dispatch({ type: 'ADD', payload: { text } }) }
//     function toggleTodo(id) { ... }
//     function deleteTodo(id) { ... }
//     ...
//     return (
//       <TodoInput onAdd={addTodo} />
//       <TodoItem onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
//       <TodoFooter activeCount={...} filter={...} onFilterChange={...} ... />
//     )
//
//   03번:
//     return (
//       <TodoProvider>
//         <TodoInput />         ← props 없음!
//         <TodoItem />          ← props 없음! (todo만 key용으로 전달)
//         <TodoFooter />        ← props 없음!
//       </TodoProvider>
//     )
//
// ── 이 버전의 한계 (다음 버전에서 해결) ─────────────────────────
//
//   - useState + Context는 상태 변경 시 Provider 전체가 리렌더
//   - 04번: useReducer + Context → dispatch 분리로 최적화
//
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider, useTodoContext } from './context'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

// ── 내부 컨텐츠 컴포넌트 ────────────────────────────────────────
//
// TodoProvider 안에서만 useTodoContext 사용 가능.
// page.tsx 최상단에서 useTodoContext를 바로 쓰면 Provider 밖이라 에러.
// → 별도 컴포넌트로 분리하고 Provider로 감싸는 패턴.
function TodoContent() {
  const { todos, filteredTodos, activeCount } = useTodoContext()

  return (
    <>
      <TodoInput />

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
  const { toggleAll } = useTodoContext()
  return (
    <>
      <input
        type="checkbox"
        checked={activeCount === 0}
        onChange={toggleAll}
        id="toggle-all"
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />
      <label htmlFor="toggle-all" className="cursor-pointer text-sm text-gray-600">
        전체 {activeCount === 0 ? '미완료로 변경' : '완료로 변경'}
      </label>
    </>
  )
}

// ── 메인 페이지 ─────────────────────────────────────────────────
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
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
            03
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useContext + useState</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          핵심: prop drilling 해결, createContext, Provider 패턴
        </p>
      </div>

      {/* Provider로 감싸면 하위 컴포넌트 어디서든 useTodoContext() 사용 가능 */}
      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </div>
  )
}
