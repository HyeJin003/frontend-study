'use client'

// ═══════════════════════════════════════════════════════════════
// 03번 연습: useContext + useState
// 📖 정답: todo-100/src/app/03/page.tsx
// ═══════════════════════════════════════════════════════════════
//
// 🟢 Step 3: context.tsx 완성 후 이 파일에서 Provider 연결
//
// ── 핵심 변화 ────────────────────────────────────────────────
//
//   02번: 상태/함수 → props로 자식에게 전달
//     <TodoInput onAdd={addTodo} />
//     <TodoItem onToggle={toggleTodo} onDelete={deleteTodo} ... />
//
//   03번: TodoProvider로 감싸면 props 전달 불필요
//     <TodoProvider>
//       <TodoInput />    ← props 없음!
//       <TodoItem />     ← props 없음!
//     </TodoProvider>
//
// ── 이미 완성된 것 (건드리지 않아도 됨) ──────────────────────
//   - TodoContent, ToggleAllCheckbox 컴포넌트 구조
//   - JSX 전체
//
// ── 여러분이 할 것 ────────────────────────────────────────────
//   - TODO [Step 3]: TodoProvider로 TodoContent를 감싸세요
//
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider, useTodoContext } from './context'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

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
          <h1 className="text-2xl font-bold text-gray-900">
            useContext + useState — 연습
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          순서: types.ts → context.tsx → page.tsx → components/
        </p>
      </div>

      {/* TODO [Step 3]: TodoProvider로 TodoContent를 감싸세요 */}
      <TodoProvider></TodoProvider>
      <TodoContent />
    </div>
  )
}
