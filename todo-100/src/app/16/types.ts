// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, 필터 탭, isPending 스피너
//   2. 어떤 상태가 바뀌나?          → todos 배열, filter (지연 처리)
//   3. 그 상태를 바꾸는 함수는?     → dispatch (ADD/TOGGLE/DELETE/SET_FILTER)
//   4. 타입을 어떻게 정의했나?      → Todo interface + FilterType + TodoAction
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → filteredTodos, dispatch, isPending 상태
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useTransition과 useDeferredValue의 차이는?"
//   A: "useTransition은 상태 업데이트 자체를 '저우선순위'로 표시합니다.
//       내가 직접 setState를 호출할 수 있을 때 씁니다.
//       useDeferredValue는 이미 존재하는 값을 지연합니다.
//       prop이나 외부에서 오는 값을 제어할 수 없을 때 씁니다."
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
