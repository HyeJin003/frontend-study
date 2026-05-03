export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
// ← 06번은 useState만 사용 — TodoAction/reducer 불필요
