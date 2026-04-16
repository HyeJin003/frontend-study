// ═══════════════════════════════════════════════════════════════
// 01번 연습: 타입 정의 (미리 제공 — 타입보다 로직에 집중)
// 📖 정답: todo-100/src/app/01/types.ts
// ═══════════════════════════════════════════════════════════════

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
