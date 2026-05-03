'use client'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, 필터 탭, isPending 스피너
//   2. 어떤 상태가 바뀌나?          → todos 배열, filter (filter는 저우선순위)
//   3. 그 상태를 바꾸는 함수는?     → dispatch — SET_FILTER는 startTransition 안에서
//   4. 타입을 어떻게 정의했나?      → useReducer로 TodoState 통합 관리
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → filteredTodos, isPending 표시
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "언제 useTransition을 써야 하나요?"
//   A: "무거운 리렌더를 유발하는 상태 변경에 씁니다. 예: 수만 건 리스트 필터,
//       탭 전환, 페이지 전환. input typing처럼 즉각 응답이 필요한 업데이트는
//       startTransition 밖에 두어 우선순위를 유지합니다."
// ─────────────────────────────────────────────────────────────

import { useReducer, useTransition, useState } from 'react'
import Link from 'next/link'
import type { Todo, FilterType, TodoAction } from './types'
import Button from '@/components/ui/Button'

// ── Reducer ──────────────────────────────────────────────────
interface TodoState {
  todos: Todo[]
  filter: FilterType
}

const initialState: TodoState = { todos: [], filter: 'all' }

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [
          { id: crypto.randomUUID(), text: action.text, completed: false, createdAt: Date.now() },
          ...state.todos,
        ],
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
      }
    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case 'EDIT':
      return {
        ...state,
        todos: state.todos.map(t => (t.id === action.id ? { ...t, text: action.text } : t)),
      }
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) }
    case 'TOGGLE_ALL': {
      const shouldComplete = state.todos.some(t => !t.completed)
      return { ...state, todos: state.todos.map(t => ({ ...t, completed: shouldComplete })) }
    }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '미완료', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoPage() {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // startTransition 안의 업데이트는 '양보' → 급한 업데이트(input typing)가 먼저 처리됨
  // 언제 쓰나: 무거운 리렌더를 유발하는 상태 변경 (대용량 리스트 필터, 페이지 전환)
  const [isPending, startTransition] = useTransition()

  const [inputText, setInputText] = useState('')

  // ── 실제 useTransition 데모를 위해 인위적 무거움 시뮬레이션 ──
  // 필터 변경 → startTransition으로 감싸서 input이 먼저 처리되도록 양보
  function handleFilterChange(value: FilterType) {
    startTransition(() => {
      dispatch({ type: 'SET_FILTER', filter: value })
    })
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD', text: trimmed })
    setInputText('')
  }

  const filteredTodos = state.todos.filter(t => {
    if (state.filter === 'active') return !t.completed
    if (state.filter === 'completed') return t.completed
    return true
  })

  const activeCount = state.todos.filter(t => !t.completed).length

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
            16
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useTransition</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          필터 변경을 저우선순위로 처리 — input 응답성 유지
        </p>
      </div>

      {/* 개념 설명 배너 */}
      <div className="mb-4 rounded-lg bg-orange-50 p-3 text-xs text-orange-700">
        <strong>startTransition:</strong> 안의 업데이트는 &apos;양보&apos; → 급한 업데이트(input typing)가 먼저 처리됨.
        필터 탭 클릭 시 isPending=true → 목록에 로딩 표시
      </div>

      {/* 입력 — startTransition 밖 → 즉각 반응 */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="새 할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        />
        <Button type="submit" size="md" disabled={!inputText.trim()}>
          추가
        </Button>
      </form>

      {/* 필터 탭 — startTransition으로 감쌈 */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                state.filter === f.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* isPending 스피너 — 필터 전환 중일 때만 표시 */}
        {isPending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        )}
      </div>

      {/* 목록 — isPending일 때 흐리게 */}
      <div className={`mt-3 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        {filteredTodos.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            {state.filter === 'completed' ? '완료된 항목이 없습니다' : '할 일이 없습니다 🎉'}
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
                  onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-orange-500"
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
                  onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
                >
                  삭제
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 푸터 */}
      {state.todos.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{activeCount}개 남음</span>
          {state.todos.some(t => t.completed) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            >
              완료 항목 삭제
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
