export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

// 04번 대비 추가: LOAD — localStorage에서 불러올 때 사용
export type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'EDIT'; id: string; text: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' }
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'LOAD'; todos: Todo[] }
