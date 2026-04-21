// ═══════════════════════════════════════════════════════════════
// 02번 연습: 타입 정의
// 📖 정답: todo-100/src/app/02/types.ts
// ═══════════════════════════════════════════════════════════════
//
// 🔴 Step 1: 여기서 시작하세요 (types.ts → reducer.ts → page.tsx 순서)
//
// 왜 타입부터? → 타입이 확정되면 IDE 자동완성이 reducer 작성을 안내해줌
// ═══════════════════════════════════════════════════════════════

// 01번과 동일 — 그대로 씁니다
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = "all" | "active" | "completed";

// TODO [Step 1]: TodoAction 유니온 타입을 정의하세요
//
// 필요한 액션: ADD / TOGGLE / DELETE / EDIT / CLEAR_COMPLETED / TOGGLE_ALL
//
// ❓ 생각해보기:
//   - 어떤 액션에 payload가 필요한가? 왜?
//   - CLEAR_COMPLETED에는 왜 payload가 없는가?
//   - { type: 'ADD'; text: string } vs { type: 'ADD'; payload: { text: string } } 차이는?
//
// 힌트: | { type: 'ADD'; payload: { text: string } } | ...
export type TodoAction =
  | { type: "ADD"; payload: { text: string } }
  | { type: "Toggle"; payload: { id: string } }
  | { type: "Toggle"; payload: { id: string } };
