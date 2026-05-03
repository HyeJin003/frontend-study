'use client'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → 검색 입력(즉각), 필터링된 todo 목록(지연)
//   2. 어떤 상태가 바뀌나?          → todos, searchQuery, filter
//   3. 그 상태를 바꾸는 함수는?     → addTodo, toggleTodo, deleteTodo
//   4. 타입을 어떻게 정의했나?      → useState로 관리, deferredQuery로 목록만 지연
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → deferredQuery 기반 filteredTodos, isStale 플래그
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "isStale 패턴은 어떻게 만드나요?"
//   A: "const isStale = searchQuery !== deferredQuery. searchQuery가 바뀌면
//       React는 즉시 deferredQuery를 업데이트하지 않습니다. 그 사이에 두 값이
//       다르면 isStale=true → 목록을 흐리게 표시해 '로딩 중' 느낌을 줍니다."
// ─────────────────────────────────────────────────────────────

import { useState, useDeferredValue } from 'react'
import Link from 'next/link'
import type { Todo, FilterType } from './types'
import Button from '@/components/ui/Button'

// 16번 useTransition vs 17번 useDeferredValue:
//   Transition은 상태 업데이트를 지연, Deferred는 값을 지연
// useDeferredValue: 외부에서 값이 오거나 제어 불가능한 prop을 지연할 때 유용

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '미완료', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')

  // useDeferredValue: searchQuery의 지연된 복사본
  // searchQuery는 즉시 업데이트 → input 응답성 유지
  // deferredQuery는 React가 여유 있을 때 업데이트 → 무거운 필터링 지연
  const deferredQuery = useDeferredValue(searchQuery)

  // isStale: searchQuery와 deferredQuery가 다르면 아직 지연 중
  const isStale = searchQuery !== deferredQuery

  // filteredTodos는 deferredQuery 기반 (즉각 반응 X, 지연된 값 사용)
  const filteredTodos = todos.filter(todo => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed)
    const matchesSearch = todo.text.toLowerCase().includes(deferredQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeCount = todos.filter(t => !t.completed).length

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return
    setTodos(prev => [
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ])
    setInputText('')
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

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
          <span className="rounded-md bg-violet-100 px-2 py-1 text-xs font-bold text-violet-700">
            17
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useDeferredValue</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          검색 input은 즉각 반응, 목록 필터링은 지연 렌더링
        </p>
      </div>

      {/* 개념 설명 배너 */}
      <div className="mb-4 rounded-lg bg-violet-50 p-3 text-xs text-violet-700">
        <strong>useDeferredValue:</strong> 16번 useTransition(상태 업데이트 지연)과 달리
        값 자체를 지연합니다. prop으로 받거나 제어 불가능한 값에 사용.
        {isStale && <span className="ml-2 font-bold">[목록 업데이트 중...]</span>}
      </div>

      {/* 할 일 추가 입력 */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="새 할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
        />
        <Button type="submit" size="md" disabled={!inputText.trim()}>
          추가
        </Button>
      </form>

      {/* 검색 입력 — searchQuery는 즉시 업데이트 (input 반응성 유지) */}
      <div className="mt-3">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="검색 (즉각 반응, 목록은 지연)"
          className="w-full rounded-lg border border-violet-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">
          입력값: &quot;{searchQuery}&quot; | 지연값: &quot;{deferredQuery}&quot;
        </p>
      </div>

      {/* 필터 탭 */}
      <div className="mt-3 flex gap-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-violet-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 목록 — isStale이면 흐리게 (이전 결과 보여주는 중) */}
      <div
        className={`mt-3 transition-opacity duration-150 ${isStale ? 'opacity-40' : 'opacity-100'}`}
      >
        {filteredTodos.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            {searchQuery ? `"${deferredQuery}" 검색 결과 없음` : '할 일이 없습니다 🎉'}
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
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-violet-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </span>
                <Button size="sm" variant="danger" onClick={() => deleteTodo(todo.id)}>
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
          <span>{activeCount}개 남음</span>
          {todos.some(t => t.completed) && (
            <Button size="sm" variant="ghost" onClick={clearCompleted}>
              완료 항목 삭제
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
