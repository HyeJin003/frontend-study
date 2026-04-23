'use client'

// ═══════════════════════════════════════════════════════════════
// 04번 연습: useContext + useReducer
// 📖 정답: todo-100/src/app/04/page.tsx
// ═══════════════════════════════════════════════════════════════
//
// 🟢 Step 4: context.tsx 완성 후 이 파일에서 Provider 연결
//
// ── 핵심 변화 ────────────────────────────────────────────────
//
//   03번: useTodoContext() 하나로 다 꺼냄
//     const { todos, addTodo } = useTodoContext()
//
//   04번: 읽기/쓰기 분리
//     const { todos } = useTodoState()    ← 상태 읽기
//     const dispatch = useTodoDispatch()  ← 액션 실행
//
// ── 여러분이 할 것 ────────────────────────────────────────────
//   - TODO [Step 4]: TodoProvider로 TodoContent를 감싸세요
//
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider, useTodoState, useTodoDispatch } from './context'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

function TodoContent() {
  const { todos, filteredTodos, activeCount } = useTodoState()

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
          <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-bold text-purple-700">
            04
          </span>
          <h1 className="text-2xl font-bold text-gray-900">
            useContext + useReducer — 연습
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          순서: types.ts → reducer.ts → context.tsx → page.tsx → components/
        </p>
      </div>

      {/* TODO [Step 4]: TodoProvider로 TodoContent를 감싸세요 */}
     <TodoProvider>
    <TodoContent />
  </TodoProvider>
    </div>
  )
}
