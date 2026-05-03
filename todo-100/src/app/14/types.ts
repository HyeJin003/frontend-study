// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, filter 탭, 입력 필드
//   2. 어떤 상태가 바뀌나?          → 추가/토글/삭제/수정/필터 변경
//   3. 그 상태를 바꾸는 함수는?     → addTodo, toggleTodo, deleteTodo, editTodo
//   4. 타입을 어떻게 정의했나?      → Todo interface + FilterType union
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → todo 객체, 핸들러 함수들
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useId는 어떤 문제를 해결하나요?"
//   A: "SSR/CSR 간 hydration 불일치를 해결합니다. Math.random()이나 index를
//       id로 사용하면 서버와 클라이언트가 다른 값을 생성해 React 경고가 발생합니다.
//       useId는 컴포넌트 트리의 위치 기반으로 동일한 ID를 생성하므로 안전합니다."
// ─────────────────────────────────────────────────────────────

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

export type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' }
  | { type: 'SET_FILTER'; filter: FilterType }
