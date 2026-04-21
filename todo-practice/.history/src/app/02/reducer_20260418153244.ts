// ═══════════════════════════════════════════════════════════════
// 02번 연습: todoReducer
// 📖 정답: todo-100/src/app/02/reducer.ts
// ═══════════════════════════════════════════════════════════════
//
// 🟡 Step 2: types.ts 완성 후 이 파일을 작성하세요
//
// ❓ reducer는 왜 "순수함수"여야 하는가?
//   → 같은 state + 같은 action → 항상 같은 결과
//   → 브라우저 없이 테스트 가능 (Node.js에서 바로)
//   → React DevTools 타임트래블 지원
//
// ─────────────────────────────────────────────────────────────

import type { Todo, TodoAction } from "./types";

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  // TODO [Step 2]: switch(action.type) { ... } 구현
  //
  // 각 case: ADD / TOGGLE / DELETE / EDIT / CLEAR_COMPLETED / TOGGLE_ALL
  //
  // 힌트: 01번의 각 함수 로직(setTodos 안의 내용)을 case 안으로 옮기면 됩니다
  //   addTodo    → case 'ADD'
  //   toggleTodo → case 'TOGGLE'
  //   deleteTodo → case 'DELETE'
  //   editTodo   → case 'EDIT'
  //   ...
  //
  // stub: return state 한 줄 덕분에 지금 dev 서버가 에러 없이 동작합니다
  // 하나씩 case를 추가하면서 브라우저에서 기능이 추가되는 걸 확인하세요
  switch (action.type) {
    case "ADD":
      return [
        {
          id: crypto.randomUUID(),
          text: action.payload.text,
          completed: false,
          createdAt: Date.now(),
        },
        ...state,
      ];
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      );
    case "DELETE":
      return state.filter((todo) => todo.id !== action.payload.id);

    case "EDIT":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo,
      );
    case "CLEAR_COMPLETED":
      return state.
  }
  return state; // ← 여기를 switch 문으로 교체하세요
}
