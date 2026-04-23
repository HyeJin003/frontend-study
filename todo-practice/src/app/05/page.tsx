'use client'

// ═══════════════════════════════════════════════════════════════
// 05번 연습: useEffect 심화
// 📖 정답: todo-100/src/app/05/page.tsx
//
// 🟢 Step 4: context.tsx 완성 후 이 파일 작성
//
// ── 04번 대비 변화 ────────────────────────────────────────────
//   - TodoSearch 컴포넌트 추가 (검색창)
//   - 새로고침해도 데이터 유지 (localStorage)
//   - 탭 제목이 미완료 개수 표시
//
// ── 여러분이 할 것 ────────────────────────────────────────────
//   1. TodoProvider로 TodoContent 감싸기
//   2. TodoContent 안에서 useTodoState()로 todos, filteredTodos, activeCount 꺼내기
//   3. TodoSearch 컴포넌트 추가
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { TodoProvider } from './context'
import TodoInput from './components/TodoInput'
import TodoSearch from './components/TodoSearch'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'

function TodoContent() {
  // 여기에 작성 — useTodoState()로 todos, filteredTodos, activeCount 꺼내기
  return <div />
}

export default function TodoPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← 목록으로
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-bold text-green-700">05</span>
          <h1 className="text-2xl font-bold text-gray-900">useEffect 심화 — 연습</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          순서: types.ts → reducer.ts → context.tsx → page.tsx → components/
        </p>
      </div>

      {/* TODO [Step 4]: TodoProvider로 TodoContent를 감싸세요 */}
      <TodoContent />
    </div>
  )
}
