// ═══════════════════════════════════════════════════════════════
// 03번 연습: 타입 정의
// 📖 정답: todo-100/src/app/03/types.ts
// ═══════════════════════════════════════════════════════════════
//
// 🔴 Step 1: 여기서 시작하세요 (types.ts → context.tsx → page.tsx 순서)
//
// 02번과의 차이:
//   - TodoAction 없음 — useState는 액션 타입 정의 불필요
// ═══════════════════════════════════════════════════════════════

// 01번, 02번과 동일
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
