'use client'

// ─────────────────────────────────────────────────────────────
// TodoFooter: 카운터 + 필터 탭 + 완료 일괄 삭제
// 02번에서 재사용 (변경 없음)
// ─────────────────────────────────────────────────────────────

import type { FilterType } from '../types'

interface TodoFooterProps {
  activeCount: number
  completedCount: number
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  onClearCompleted: () => void
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoFooter({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}: TodoFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4">
      <span className="text-sm text-gray-500">
        <strong className="font-semibold text-gray-800">{activeCount}</strong>개 남음
      </span>

      <div className="flex gap-1" role="group" aria-label="할일 필터">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
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
          onClick={onClearCompleted}
          className="text-xs text-gray-400 underline hover:text-red-500
            focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          완료 {completedCount}개 삭제
        </button>
      )}
    </div>
  )
}
