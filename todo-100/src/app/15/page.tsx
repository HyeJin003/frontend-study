'use client'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → 외부 스토어의 todos + 필터 UI
//   2. 어떤 상태가 바뀌나?          → React 바깥 스토어(todos), React 안 필터
//   3. 그 상태를 바꾸는 함수는?     → todoStore.addTodo/toggleTodo/deleteTodo
//   4. 타입을 어떻게 정의했나?      → store에서 Todo[] 타입 그대로
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → todos 배열, 핸들러 함수들
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useEffect + useState로 외부 스토어를 구독하면 안 되나요?"
//   A: "React 18 Concurrent Mode에서 tearing이 발생합니다. 렌더 도중 상태가
//       바뀌면 일부 컴포넌트는 이전 값, 일부는 새 값을 보게 됩니다.
//       useSyncExternalStore는 이를 방지하는 공식 API입니다."
// ─────────────────────────────────────────────────────────────

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { todoStore } from './store'
import type { FilterType } from './types'
import Button from '@/components/ui/Button'

// useSyncExternalStore: React 바깥 상태를 React와 동기화.
// Zustand/Redux 내부에서 쓰는 패턴
// getServerSnapshot: SSR 시 서버에서 반환할 값 (보통 빈 배열)

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '미완료', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoPage() {
  // 외부 스토어 구독 — React state가 아닌 todoStore의 todos를 직접 구독
  const todos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
    todoStore.getServerSnapshot,
  )

  // 필터는 순수 UI 상태 → useState로 관리
  const [filter, setFilter] = useState<FilterType>('all')
  const [inputText, setInputText] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return
    todoStore.addTodo(trimmed) // React setState 없이 스토어 직접 변경
    setInputText('')
  }

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

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
          <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
            15
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useSyncExternalStore</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          React 바깥 상태 구독 — localStorage 기반 외부 스토어
        </p>
      </div>

      {/* 개념 설명 배너 */}
      <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
        <strong>useSyncExternalStore:</strong> React 바깥 상태를 React와 동기화.
        Zustand · Redux 내부에서 쓰는 패턴. 페이지를 새로고침해도 localStorage에서 복원됩니다.
      </div>

      {/* 입력 */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="새 할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <Button type="submit" size="md" disabled={!inputText.trim()}>
          추가
        </Button>
      </form>

      {/* 필터 탭 */}
      <div className="mt-4 flex gap-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="mt-3">
        {filteredTodos.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            {filter === 'completed' ? '완료된 항목이 없습니다' : '할 일이 없습니다 🎉'}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoStore.toggleTodo(todo.id)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-emerald-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => todoStore.deleteTodo(todo.id)}
                >
                  삭제
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 푸터 */}
      {todos.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{activeCount}개 남음 (localStorage 저장됨)</span>
          {todos.some(t => t.completed) && (
            <Button size="sm" variant="ghost" onClick={() => todoStore.clearCompleted()}>
              완료 항목 삭제
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
