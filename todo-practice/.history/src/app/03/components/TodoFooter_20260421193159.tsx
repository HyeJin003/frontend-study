'use client'

import { useTodoContext } from "../context"
import { FilterType } from "../types"

// ─────────────────────────────────────────────────────────────
// TodoFooter: 카운터 + 필터 탭 + 완료 일괄 삭제
// 📖 정답: todo-100/src/app/03/components/TodoFooter.tsx
//
// TODO [Step 4-D]:
//   ← 02번: 5개 props를 받았음
//     activeCount, completedCount, filter, onFilterChange, onClearCompleted
//
//   03번: props 없이 Context에서 직접 꺼냄
//     const { activeCount, completedCount, filter, setFilter, clearCompleted } = useTodoContext()
// ─────────────────────────────────────────────────────────────

const FILTER_OPTIONS :{label: string, value:FilterType}[] =[

{label:'전체', value:'all'},
{label:'진행중', value:'active'},
{label:'완료', value:'completed'},
] 
export default function TodoFooter() {
  // 여기에 useTodoContext() 사용 후 구현
  const {activeCount ,  completedCount ,  filter , setFilter , clearCompleted} = useTodoContext()
  return(
<div>
  <span className="text-sm text-gray-500">
  <strong className="font-semibold text-gray-800">{activeCount}
    </strong>개 남음</span></div>

  )
}
