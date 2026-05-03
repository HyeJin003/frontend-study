'use client'

// ═══════════════════════════════════════════════════════════════
// 07번: useEffect — 외부 시스템 동기화
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. localStorage 초기 로드를 어떻게 할까?
//      → useLocalStorage 훅의 lazy initializer로 처리
//        (useEffect보다 깔끔: 첫 렌더 전에 localStorage 값 세팅)
//
//   2. document.title 관리를 어떻게 할까?
//      → useDocumentTitle 훅으로 추상화 (클린업도 자동 처리)
//
//   3. 이전 07번의 isLoaded 가드가 왜 사라졌나?
//      → useLocalStorage의 lazy initializer는 렌더 전 실행
//        → 초기값이 이미 localStorage에서 온 값 → 빈 배열로 덮어쓸 일 없음
//        → isLoaded, LOAD 액션, 별도 useEffect 전부 불필요
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "커스텀 훅을 왜 만드나요?"
//   A: "① 로직 재사용 — 다른 컴포넌트에서 import 한 줄로 사용
//       ② 관심사 분리 — page.tsx는 UI만, hooks.ts는 외부 시스템 동기화만
//       ③ 테스트 용이 — 훅만 독립 테스트 가능
//       이 세 가지가 커스텀 훅을 만드는 실무 이유입니다."
//
// ← 06번: useRef 기반 훅 (usePrevious, useDebounce)
// ← 07번: useEffect 기반 훅 (useLocalStorage, useDocumentTitle)
//
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useLocalStorage, useDocumentTitle } from './hooks'
import type { Todo, FilterType } from './types'

export default function TodoPage() {
  // ── useLocalStorage: useState처럼 쓰되 자동 영속 ────────────
  const [todos, setTodos] = useLocalStorage<Todo[]>('todo-07', [])
  const [filter, setFilter] = useState<FilterType>('all')
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // ── 파생 데이터 ──────────────────────────────────────────────
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length
  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  // ── useDocumentTitle: 미완료 개수를 탭 제목에 반영 ───────────
  useDocumentTitle(
    activeCount > 0 ? `(${activeCount}) Todo 07` : 'Todo 07 — 모두 완료!'
  )

  // ── CRUD ─────────────────────────────────────────────────────
  function addTodo() {
    const trimmed = inputText.trim()
    if (!trimmed) return
    setTodos(prev => [
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ])
    setInputText('')
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
          <span className="rounded-md bg-teal-100 px-2 py-1 text-xs font-bold text-teal-700">
            07
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useEffect — 외부 시스템 동기화</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          useLocalStorage · useDocumentTitle 커스텀 훅
        </p>
      </div>

      {/* useEffect 패턴 설명 박스 */}
      <div className="mb-6 rounded-lg bg-teal-50 p-4 text-xs text-teal-800 space-y-1">
        <p className="font-semibold">실무 useEffect 패턴 (hooks.ts):</p>
        <p>① useLocalStorage(key, default) — localStorage와 동기화</p>
        <p>   내부: lazy initializer(마운트 전 로드) + useEffect(값 바뀔 때 저장)</p>
        <p>② useDocumentTitle(title) — 탭 제목 + 언마운트 시 복원(클린업)</p>
        <p className="mt-1 text-teal-600 font-medium">새로고침해도 데이터 유지 · 탭 제목: ({activeCount}) Todo 07</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Button onClick={addTodo} disabled={!inputText.trim()}>추가</Button>
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
            {filter === 'all' ? '할 일이 없습니다' : '해당하는 항목이 없습니다'}
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
