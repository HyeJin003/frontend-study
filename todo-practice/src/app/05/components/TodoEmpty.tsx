// ─────────────────────────────────────────────────────────────
// TodoEmpty: 빈 상태 메시지
// 📖 정답: todo-100/src/app/05/components/TodoEmpty.tsx
//
// TODO [Step 4-D]:
//   const { filter, searchQuery } = useTodoState()
//   searchQuery 있으면 → '"검색어" 검색 결과가 없어요'
//   filter === 'active' → '진행 중인 할일이 없어요!'
//   filter === 'completed' → '완료된 할일이 없어요!'
//   기본 → '할일을 추가해보세요!'
// ─────────────────────────────────────────────────────────────

import { useTodoState } from '../context'

export default function TodoEmpty() {
  // 여기에 작성
  return <div />
}
