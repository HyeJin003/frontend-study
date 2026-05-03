'use client'

// ← 08번: setFilter는 context의 useCallback 버전 (context.tsx 참고)
//    → dispatch({ type: 'SET_FILTER' }) 대신 setFilter(f) 사용

import { useTodoState, useTodoDispatch } from '../context'
import type { FilterType } from '../types'

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '진행중', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function TodoFooter() {
  const { activeCount, completedCount, filter, setFilter } = useTodoState()
  const dispatch = useTodoDispatch()

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">
        <strong className="font-semibold text-gray-800">{activeCount}</strong>개 남음
      </span>
      <div className="flex gap-1" role="group" aria-label="할일 필터">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              filter === value ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button
          onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          className="text-xs text-gray-400 underline hover:text-red-500"
        >
          완료 {completedCount}개 삭제
        </button>
      )}
    </div>
  )
}
