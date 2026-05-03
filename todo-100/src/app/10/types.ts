export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

// ← 09번과 동일
export type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' }
  | { type: 'LOAD'; todos: Todo[] }
