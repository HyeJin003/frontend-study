// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, 추가/삭제/토글 UI
//   2. 어떤 상태가 바뀌나?          → React 바깥(외부 스토어)에서 todos 배열
//   3. 그 상태를 바꾸는 함수는?     → store.addTodo, store.toggleTodo, store.deleteTodo
//   4. 타입을 어떻게 정의했나?      → Todo interface + FilterType union
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → useSyncExternalStore가 반환한 스냅샷
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useSyncExternalStore는 왜 필요한가요?"
//   A: "React 바깥의 상태(Zustand, Redux, DOM 이벤트 등)를 구독할 때,
//       Concurrent Mode에서 발생하는 tearing(찢김) 현상을 방지합니다.
//       getSnapshot이 동기적으로 일관된 값을 반환하도록 보장합니다."
// ─────────────────────────────────────────────────────────────

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
