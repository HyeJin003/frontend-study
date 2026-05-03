export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
// ← 07번은 useLocalStorage 훅으로 영속성 관리 — reducer/action 불필요
