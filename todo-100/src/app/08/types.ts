export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

// ← SET_FILTER 없음 — filter는 context의 useState로 관리 (reducer 밖)
export type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' }
  | { type: 'LOAD'; todos: Todo[] }
