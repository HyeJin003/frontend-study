'use client'

// ─────────────────────────────────────────────────────────────
// TodoFooter: 카운터 + 필터 탭 + 완료 일괄 삭제
//
// 03번 핵심 변화:
//   ← 02번: activeCount, completedCount, filter, onFilterChange, onClearCompleted
//           5개 props를 page.tsx에서 전달받았음
//
//   03번: props 없이 Context에서 직접 꺼냄
//     const { activeCount, completedCount, filter, setFilter, clearCompleted } = useTodoContext()
// ─────────────────────────────────────────────────────────────

import type { FilterType } from '../types'
import { useTodoContext } from '../context'

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoFooter() {
  // ← 02번: 5개 props로 받았음
  const { activeCount, completedCount, filter, setFilter, clearCompleted } = useTodoContext()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4">
      <span className="text-sm text-gray-500">
        <strong className="font-semibold text-gray-800">{activeCount}</strong>개 남음
      </span>

      <div className="flex gap-1" role="group" aria-label="할일 필터">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${
                filter === value
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="text-xs text-gray-400 underline hover:text-red-500
            focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          완료 {completedCount}개 삭제
        </button>
      )}
    </div>
  )
}
