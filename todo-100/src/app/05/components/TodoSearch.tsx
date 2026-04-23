'use client'

// 검색어 입력 → rawQuery 즉시 반영 → 300ms 후 debouncedQuery로 필터링
// 디바운스 로직은 context.tsx의 useEffect 안에 있음

import { useTodoState } from '../context'

export default function TodoSearch() {
  const { searchQuery, setSearchQuery } = useTodoState()

  return (
    <input
      type="search"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      placeholder="검색..."
      aria-label="할일 검색"
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm
        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  )
}
