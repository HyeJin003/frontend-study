// ═══════════════════════════════════════════════════════════════
// 05번 연습: reducer.ts
// 📖 정답: todo-100/src/app/05/reducer.ts
//
// 🔴 Step 2: types.ts 완성 후 작성하세요
//
// ❓ 생각해보기:
//   - LOAD 케이스는 무엇을 해야 하나요?
//   - initialState의 todos는 왜 빈 배열로 시작하나요?
//     (localStorage 로딩은 어디서 하나요?)
//   - 04번 reducer와 다른 점은 무엇인가요?
// ═══════════════════════════════════════════════════════════════

import type { Todo, FilterType, TodoAction } from './types'

// TODO [Step 2-A]: TodoState 인터페이스 정의
export interface TodoState {
  // 여기에 작성
}

// TODO [Step 2-B]: initialState 정의
// 힌트: todos는 빈 배열로 시작 — localStorage 로딩은 useEffect에서
export const initialState: TodoState = {
  // 여기에 작성
}

// TODO [Step 2-C]: todoReducer 구현
// 힌트: 04번 케이스 전부 + LOAD 케이스 추가
export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  // 여기에 작성
  return state
}
