export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

// ── 02번과 달리 SET_FILTER 추가 ──────────────────────────────
// 03번에서 filter를 useState로 따로 관리했는데
// 04번에서는 reducer가 모든 상태를 관리 → SET_FILTER 액션 필요
export type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' }
  | { type: 'SET_FILTER'; filter: FilterType }
