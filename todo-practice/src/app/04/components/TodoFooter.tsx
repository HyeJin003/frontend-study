'use client'

import { useTodoState, useTodoDispatch } from '../context'
import type { FilterType } from '../types'

// ─────────────────────────────────────────────────────────────
// TodoFooter: 카운터 + 필터 탭 + 완료 일괄 삭제
// 📖 정답: todo-100/src/app/04/components/TodoFooter.tsx
//
// TODO [Step 4-D]:
//   ← 03번: const { activeCount, completedCount, filter, setFilter, clearCompleted } = useTodoContext()
//   04번: 읽기/쓰기 분리
//     const { activeCount, completedCount, filter } = useTodoState()
//     const dispatch = useTodoDispatch()
//     dispatch({ type: 'SET_FILTER', filter: value })
//     dispatch({ type: 'CLEAR_COMPLETED' })
// ─────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '진행중', value: 'active' },
  { label: '완료', value: 'completed' },
]
export default function TodoFooter() {

  const {activeCount , completedCount ,filter} = useTodoState()
  const dispatch =useTodoDispatch()
  // 여기에 작성

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">
        <strong className="font-semibold text-gray-800">{activeCount}</strong>개 남음
      </span>

      <div className="flex gap-1" role="group" aria-label="할일 필터">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => dispatch({ type: 'SET_FILTER', filter: value })}
            aria-pressed={filter === value}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${filter === value ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button
          onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          className="text-xs text-gray-400 underline hover:text-red-500
            focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          완료 {completedCount}개 삭제
        </button>
      )}
    </div>
  )
}
