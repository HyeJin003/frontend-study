// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, 검색 입력, 필터 탭
//   2. 어떤 상태가 바뀌나?          → todos, searchQuery (즉각), deferredQuery (지연)
//   3. 그 상태를 바꾸는 함수는?     → addTodo, toggleTodo, deleteTodo, setSearchQuery
//   4. 타입을 어떻게 정의했나?      → Todo interface + FilterType union
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → deferredQuery 기반 filteredTodos
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useDeferredValue는 언제 useTransition보다 나은가요?"
//   A: "prop이나 외부에서 오는 값처럼 setState를 직접 제어할 수 없을 때 씁니다.
//       예: 부모에서 받은 searchQuery prop을 자식에서 지연 렌더링하고 싶을 때.
//       내가 setState를 직접 호출할 수 있다면 useTransition이 더 명확합니다."
// ─────────────────────────────────────────────────────────────

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
