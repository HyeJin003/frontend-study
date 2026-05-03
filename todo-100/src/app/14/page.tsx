'use client'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, 추가 입력, toggle-all 체크박스
//   2. 어떤 상태가 바뀌나?          → todos 배열, filter, 입력 텍스트
//   3. 그 상태를 바꾸는 함수는?     → addTodo, toggleTodo, deleteTodo, editTodo
//   4. 타입을 어떻게 정의했나?      → Todo interface, FilterType union
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → useId로 생성한 label-input 연결 ID
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "index를 key나 htmlFor에 쓰면 안 되는 이유는?"
//   A: "리스트가 재정렬되면 index가 다른 항목에 붙어 React가 잘못된 DOM을
//       재사용합니다. useId는 컴포넌트 인스턴스에 고정된 값을 반환해 항상 안전합니다."
// ─────────────────────────────────────────────────────────────

import { useState, useId } from 'react'
import Link from 'next/link'
import type { Todo, FilterType } from './types'
import Button from '@/components/ui/Button'

// ── TodoInput: useId로 label-input 연결 ──────────────────────
// Math.random()이나 index를 id로 쓰면 SSR/CSR hydration 불일치 →
// useId는 서버/클라이언트에서 동일한 ID 생성 (컴포넌트 트리 위치 기반)
// useId는 렌더마다 같은 값 → 안정적 참조
function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const inputId = useId() // ← SSR-safe unique ID
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      {/* useId()로 만든 id를 label과 input에 동시에 사용 → 접근성 확보 */}
      <label
        htmlFor={inputId}
        className="text-xs font-medium text-gray-500"
      >
        할 일 입력 (id={inputId})
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="새 할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <Button type="submit" size="md" disabled={!text.trim()}>
          추가
        </Button>
      </div>
    </form>
  )
}

// ── TodoItem: 각 항목의 편집 입력도 useId ────────────────────
function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}) {
  const editInputId = useId()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onEdit(todo.id, trimmed)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2">
        <form onSubmit={handleEditSubmit} className="flex flex-1 items-center gap-2">
          <label htmlFor={editInputId} className="sr-only">
            할 일 수정
          </label>
          <input
            id={editInputId}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            className="flex-1 rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none"
          />
          <Button type="submit" size="sm">
            저장
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsEditing(false)
              setDraft(todo.text)
            }}
          >
            취소
          </Button>
        </form>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />
      <span
        className={`flex-1 text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
        onDoubleClick={() => setIsEditing(true)}
      >
        {todo.text}
      </span>
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        수정
      </Button>
      <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>
        삭제
      </Button>
    </li>
  )
}

// ── ToggleAllSection: toggle-all 체크박스도 useId ────────────
function ToggleAllSection({
  todos,
  onToggleAll,
}: {
  todos: Todo[]
  onToggleAll: () => void
}) {
  const toggleAllId = useId()
  const allCompleted = todos.length > 0 && todos.every(t => t.completed)

  return (
    <div className="flex items-center gap-2">
      <input
        id={toggleAllId}
        type="checkbox"
        checked={allCompleted}
        onChange={onToggleAll}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
      />
      <label htmlFor={toggleAllId} className="cursor-pointer text-sm text-gray-600">
        전체 {allCompleted ? '미완료로 변경' : '완료로 변경'}
      </label>
    </div>
  )
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '미완료', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')

  function addTodo(text: string) {
    setTodos(prev => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ])
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function editTodo(id: string, text: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)))
  }

  function toggleAll() {
    const shouldComplete = todos.some(t => !t.completed)
    setTodos(prev => prev.map(t => ({ ...t, completed: shouldComplete })))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
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
          <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">
            14
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useId</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          SSR-safe 고유 ID 생성 — label-input 접근성 연결
        </p>
      </div>

      {/* useId 데모 설명 */}
      <div className="mb-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700">
        <strong>useId 핵심:</strong> Math.random() · index 대신 useId() 사용 →
        서버/클라이언트 동일 ID 생성, hydration 불일치 방지
      </div>

      <TodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <div className="mt-4">
          <ToggleAllSection todos={todos} onToggleAll={toggleAll} />
        </div>
      )}

      {/* 필터 탭 */}
      <div className="mt-4 flex gap-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-indigo-500 text-white'
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
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
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
