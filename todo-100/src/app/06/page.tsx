'use client'

// ═══════════════════════════════════════════════════════════════
// 06번: useRef — 실무 패턴 3가지
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?   → todos 목록, 검색창, 이전→현재 카운트 변화
//   2. useRef를 어디에 쓰나?
//      ① inputRef          → DOM 직접 접근 (포커스)
//      ② usePrevious 훅    → 이전 activeCount 추적 (리렌더 없이 이전 값 유지)
//      ③ useDebounce 훅    → 검색 타이머 ID를 ref로 관리
//   3. 왜 커스텀 훅으로 분리했나?
//      → 재사용성. hooks.ts 하나로 어느 프로젝트에서든 import 한 줄.
//      → 05번: context 안에 디바운스 로직 직접 작성 (일회성)
//         06번: useDebounce 훅 추상화 → 한 줄로 사용
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "usePrevious는 어떻게 구현하나요?"
//   A: "useRef와 useEffect를 조합합니다.
//       useEffect는 렌더 이후에 실행되므로,
//       return ref.current 시점은 이전 렌더의 값을 담고 있습니다.
//       effect가 실행된 후에야 ref.current가 최신 값으로 갱신됩니다."
//
//   Q: "useDebounce에서 timerRef가 왜 필요한가요?"
//   A: "타이머 ID를 useState로 관리하면 setTimerId 호출 자체가 리렌더를 유발합니다.
//       useRef는 .current 변경 시 리렌더가 없으므로
//       타이머 ID처럼 UI에 반영할 필요 없는 값은 ref로 관리합니다."
//
// ← 05번: useEffect 심화 (localStorage, 디바운스 직접 작성)
// ← 06번: useRef 기반 커스텀 훅으로 추상화
//
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { usePrevious, useDebounce } from './hooks'
import type { Todo, FilterType } from './types'

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [inputText, setInputText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // ── useRef 용도 ① DOM 접근 ──────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null)

  // ── useRef 용도 ② usePrevious: 이전 activeCount 추적 ────────
  const activeCount = todos.filter(t => !t.completed).length
  const prevActiveCount = usePrevious(activeCount)

  // ── useRef 용도 ③ useDebounce: 타이머 ID를 ref로 관리 ────────
  const debouncedSearch = useDebounce(searchQuery, 300)

  // ── 마운트 시 input 자동 포커스 ─────────────────────────────
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ── CRUD ─────────────────────────────────────────────────────
  function addTodo() {
    const trimmed = inputText.trim()
    if (!trimmed) return
    setTodos(prev => [
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ])
    setInputText('')
    inputRef.current?.focus()
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  function commitEdit(id: string) {
    const trimmed = editText.trim()
    if (!trimmed) return
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: trimmed } : t))
    setEditingId(null)
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function toggleAll() {
    const allDone = todos.every(t => t.completed)
    setTodos(prev => prev.map(t => ({ ...t, completed: !allDone })))
  }

  // ── 파생 데이터 ──────────────────────────────────────────────
  const completedCount = todos.filter(t => t.completed).length

  // filter + debouncedSearch 동시 적용
  const filteredTodos = todos.filter(t => {
    const matchesFilter =
      filter === 'active' ? !t.completed :
      filter === 'completed' ? t.completed :
      true
    const matchesSearch = t.text.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // ── usePrevious로 카운트 변화 메시지 계산 ────────────────────
  // prevActiveCount: 이전 렌더의 activeCount (직전 render 시점)
  // 초기 렌더(prevActiveCount === undefined)에는 메시지 없음
  const countDiff = prevActiveCount !== undefined ? activeCount - prevActiveCount : 0
  const countMessage =
    countDiff < 0 ? `✅ ${Math.abs(countDiff)}개 완료됨` :
    countDiff > 0 ? `📝 ${countDiff}개 추가됨` :
    null

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
          <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
            06
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useRef — 실무 패턴 3가지</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          DOM 접근 · usePrevious · useDebounce 커스텀 훅
        </p>
      </div>

      {/* useRef 패턴 설명 박스 */}
      <div className="mb-6 rounded-lg bg-orange-50 p-4 text-xs text-orange-800 space-y-1">
        <p className="font-semibold">실무 useRef 패턴 (hooks.ts):</p>
        <p>① inputRef.current?.focus() — DOM 직접 접근</p>
        <p>② usePrevious(activeCount) — 이전 값 추적 (리렌더 없이)</p>
        <p>③ useDebounce(searchQuery, 300) — 타이머 ID를 ref로 관리</p>
        {countMessage && (
          <p className="mt-2 font-semibold text-orange-700">
            {countMessage} &nbsp;|&nbsp; 이전: {prevActiveCount} → 현재: {activeCount}
          </p>
        )}
      </div>

      {/* Input 영역 */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Button onClick={addTodo} disabled={!inputText.trim()}>추가</Button>
      </div>

      {/* 검색 (useDebounce) */}
      <div className="mt-3">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="할 일 검색 (300ms 디바운스)"
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* 전체 선택 */}
      {todos.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="toggle-all"
            checked={activeCount === 0}
            onChange={toggleAll}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
          />
          <label htmlFor="toggle-all" className="cursor-pointer text-sm text-gray-600">
            전체 {activeCount === 0 ? '미완료로 변경' : '완료로 변경'}
          </label>
        </div>
      )}

      {/* 할 일 목록 */}
      <ul className="mt-4 flex flex-col gap-2">
        {filteredTodos.length === 0 ? (
          <li className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
            {debouncedSearch ? `"${debouncedSearch}" 검색 결과 없음` : '할 일이 없습니다'}
          </li>
        ) : (
          filteredTodos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
              />
              {editingId === todo.id ? (
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitEdit(todo.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onBlur={() => commitEdit(todo.id)}
                  autoFocus
                  className="flex-1 rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              ) : (
                <span
                  className={`flex-1 text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                  onDoubleClick={() => startEdit(todo)}
                >
                  {todo.text}
                </span>
              )}
              <Button size="sm" variant="ghost" onClick={() => startEdit(todo)}>수정</Button>
              <Button size="sm" variant="danger" onClick={() => deleteTodo(todo.id)}>삭제</Button>
            </li>
          ))
        )}
      </ul>

      {/* 푸터 */}
      {todos.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1">
            {(['all', 'active', 'completed'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? '전체' : f === 'active' ? '미완료' : '완료'}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500">{activeCount}개 남음</span>
          {completedCount > 0 && (
            <Button size="sm" variant="ghost" onClick={clearCompleted}>완료 삭제</Button>
          )}
        </div>
      )}
    </div>
  )
}
