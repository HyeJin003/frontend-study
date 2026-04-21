// ═══════════════════════════════════════════════════════════════
// 03번: useContext + useState — 타입 정의
// ═══════════════════════════════════════════════════════════════
//
// ── 실무 개발 순서 ──────────────────────────────────────────────
//
//   🔴 Step 1: types.ts   — 데이터 구조 정의  ← 지금 여기
//   🟡 Step 2: context.tsx — TodoProvider + useTodoContext
//   🟢 Step 3: page.tsx    — Provider로 감싸기
//   🟢 Step 4: components/ — useContext로 직접 꺼내 쓰기
//
// ── 02번과의 차이 ───────────────────────────────────────────────
//
//   02번: TodoAction 유니온 타입 필요 (useReducer용)
//   03번: TodoAction 없음 — useState는 액션 타입 정의 불필요
//         상태 변경은 setTodos 직접 호출
//
// ═══════════════════════════════════════════════════════════════

// 01번, 02번과 동일 — 데이터 모델은 상태 관리 방식과 무관
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
