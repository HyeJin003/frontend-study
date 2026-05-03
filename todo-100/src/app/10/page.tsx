'use client'

// ═══════════════════════════════════════════════════════════════
// 10번: React.memo — 컴포넌트 메모이제이션
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 왜 10번 컴포넌트는 context를 직접 구독하지 않나?
//      → context를 직접 구독하면 context 변경 시 무조건 리렌더
//      → memo가 있어도 context 변경은 막을 수 없음
//      → props로 필요한 값만 받아야 memo가 진짜 효과를 냄
//
//   2. useCallback의 역할
//      → 함수 참조를 안정화 → memo가 "props 같음"으로 판단 → 리렌더 스킵
//      → useCallback 없으면 매 렌더마다 새 함수 → memo 무효
//
//   3. 렌더 카운터(×N)로 확인할 것:
//      → 타이핑 중: 타이핑 항목(TodoInput)만 리렌더, TodoItem들은 스킵
//      → 특정 todo 토글: 해당 TodoItem만 리렌더, 나머지는 스킵
//      → 부모(TodoContent) 렌더 횟수 vs 자식 렌더 횟수 비교
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "React.memo, useCallback, useMemo를 함께 쓰는 이유가 뭔가요?"
//   A: "useMemo → 값(객체/배열) 참조 안정화
//       useCallback → 함수 참조 안정화
//       React.memo → props가 바뀌지 않으면 컴포넌트 리렌더 스킵
//       세 가지가 함께 쓰여야 진짜 최적화가 됩니다."
//
// ← 08번: useCallback 함수 안정화
// ← 09번: useMemo 값 안정화
// ← 10번: React.memo 컴포넌트 메모이제이션 (08+09 완성)
//
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { TodoProvider, useTodoState, useTodoDispatch } from './context'
import TodoInput from './components/TodoInput'
import TodoItem from './components/TodoItem'
import TodoEmpty from './components/TodoEmpty'
import TodoFooter from './components/TodoFooter'
import type { FilterType } from './types'

function TodoContent() {
  const { todos, filter, filteredTodos, activeCount, completedCount, setFilter } = useTodoState()
  const dispatch = useTodoDispatch()

  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // 부모 렌더 횟수 추적
  const parentRenderCount = useRef(0)
  parentRenderCount.current += 1

  // ── useCallback: 모든 props 함수를 stable하게 유지 ────────────
  // deps에 있는 값이 바뀌지 않으면 동일한 함수 참조 유지
  // → memo가 "props 같음"으로 판단 → 자식 리렌더 스킵

  const handleInputChange = useCallback((text: string) => {
    setInputText(text)
  }, []) // setInputText는 stable → deps 빈 배열

  const handleAdd = useCallback(() => {
    const trimmed = inputText.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD', text: trimmed })
    setInputText('')
  }, [inputText, dispatch])

  const handleToggle = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE', id })
  }, [dispatch])

  const handleDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE', id })
  }, [dispatch])

  const handleStartEdit = useCallback((id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }, [])

  // onCommitEdit: (id, text) 받아서 parent의 editText에 의존하지 않음
  // → deps: [dispatch] 만으로 stable 유지
  const handleCommitEdit = useCallback((id: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'EDIT', id, text: trimmed })
    setEditingId(null)
  }, [dispatch])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  const handleEditChange = useCallback((text: string) => {
    setEditText(text)
  }, [])

  const handleToggleAll = useCallback(() => {
    dispatch({ type: 'TOGGLE_ALL' })
  }, [dispatch])

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' })
  }, [dispatch])

  return (
    <>
      <div className="mb-4 rounded-lg bg-violet-50 p-3 text-xs text-violet-700">
        부모(TodoContent) 렌더 횟수: <strong>{parentRenderCount.current}</strong>
        <span className="ml-2 text-violet-400">— 타이핑해도 아래 ×숫자가 안 올라야 memo 작동 중</span>
      </div>

      <TodoInput
        value={inputText}
        onChange={handleInputChange}
        onAdd={handleAdd}
      />

      {todos.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="toggle-all"
            checked={activeCount === 0}
            onChange={handleToggleAll}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
          />
          <label htmlFor="toggle-all" className="cursor-pointer text-sm text-gray-600">
            전체 {activeCount === 0 ? '미완료로 변경' : '완료로 변경'}
          </label>
        </div>
      )}

      <div className="mt-4">
        {filteredTodos.length === 0 ? (
          <TodoEmpty filter={filter} />
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                editText={editText}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onStartEdit={handleStartEdit}
                onCommitEdit={handleCommitEdit}
                onCancelEdit={handleCancelEdit}
                onEditChange={handleEditChange}
              />
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="mt-4">
          <TodoFooter
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
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
          <span className="rounded-md bg-violet-100 px-2 py-1 text-xs font-bold text-violet-700">
            10
          </span>
          <h1 className="text-2xl font-bold text-gray-900">React.memo — 컴포넌트 메모이제이션</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          memo + useCallback 조합 완성 · ×렌더 카운터로 최적화 확인
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-violet-50 p-4 text-xs text-violet-800 space-y-1">
        <p className="font-semibold">React.memo 핵심:</p>
        <p>① memo(Component) — props 변경 없으면 리렌더 스킵</p>
        <p>② useCallback 없이 함수 props 전달 → 매 렌더마다 새 참조 → memo 무효</p>
        <p>③ props 기반 컴포넌트 + useCallback = 진짜 리렌더 방지</p>
      </div>

      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    </div>
  )
}
