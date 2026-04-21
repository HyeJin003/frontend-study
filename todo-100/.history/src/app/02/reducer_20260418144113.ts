// ═══════════════════════════════════════════════════════════════
// 02번: useReducer — 순수 로직 (reducer)
// ═══════════════════════════════════════════════════════════════
//
// ── 실무 개발 순서 ──────────────────────────────────────────────
//
//   🔴 Step 1: types.ts  완료
//   🟡 Step 2: reducer.ts ← 지금 여기 (순수 로직 구현)
//   🟢 Step 3: page.tsx   → useReducer로 연결
//
// ── 핵심 개념: 순수함수 (Pure Function) ──────────────────────────
//
//   (이전 state, action) → 새 state
//
//   ✅ 같은 state + 같은 action → 항상 같은 결과
//   ✅ 외부 변수 읽기/쓰기 없음 (전역 변수, 클로저 변수 참조 X)
//   ✅ API 호출, 타이머, localStorage, console.log 없음
//
//   왜 순수함수여야 하는가?
//   1. 테스트: 브라우저 없이 Node.js에서 바로 검증 가능
//      → todoReducer([], { type: 'ADD', payload: { text: '운동' } }).length === 1
//   2. 타임트래블 디버깅: Redux DevTools에서 액션 되감기/재실행 가능
//      (같은 state + 같은 action = 항상 같은 결과이므로 재현 가능)
//   3. 예측 가능성: 상태가 왜 바뀌었는지 action 하나로 추적
//
// ── 01번과의 핵심 차이 ─────────────────────────────────────────
//
//   01번: 로직이 컴포넌트 안에 분산
//     function addTodo(text: string) {
//       const newTodo = { id: crypto.randomUUID(), ... }
//       setTodos(prev => [newTodo, ...prev])  ← "어떻게" 직접 기술
//     }
//     → 컴포넌트가 무거워짐, 테스트하려면 React 환경 필요
//
//   02번: 로직이 reducer에 집중
//     dispatch({ type: 'ADD', payload: { text } })  ← "무엇을" 선언
//     → 컴포넌트는 배선만, reducer는 로직만 → 각자 단순해짐
//
// ═══════════════════════════════════════════════════════════════

import type { Todo, TodoAction } from "./types";

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD":
      // ← 01번: setTodos(prev => [{ id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() }, ...prev])
      //
      // ❓ crypto.randomUUID()가 순수함수 원칙 위반 아닌가?
      //   → 엄밀히는 맞음 (매 호출마다 다른 값)
      //   → 완벽한 순수성 원할 때: action.payload에 id를 포함시켜 dispatch 전 생성
      //     dispatch({ type: 'ADD', payload: { id: crypto.randomUUID(), text } })
      //   → 실무에서는 reducer 안 id 생성이 허용되는 패턴으로 통용됨→ 실무에서는 reducer 안 id 생성이 허용되는 패턴으로 통용됨
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
      // ← 01번: setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      );

    case "DELETE":
      // ← 01번: setTodos(prev => prev.filter(t => t.id !== id))
      return state.filter((todo) => todo.id !== action.payload.id);

    case "EDIT":
      // ← 01번: setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo,
      );

    case "CLEAR_COMPLETED":
      // ← 01번: setTodos(prev => prev.filter(t => !t.completed))
      return state.filter((todo) => !todo.completed);

    case "TOGGLE_ALL": {
      // ← 01번: page.tsx에서 activeCount props를 받아 계산
      //         const shouldComplete = activeCount > 0
      //         setTodos(prev => prev.map(t => ({ ...t, completed: shouldComplete })))
      //
      // 02번 차이: reducer가 state를 직접 참조 → props 없이 계산 가능
      //   "미완료 항목이 하나라도 있으면 전체 완료, 모두 완료면 전체 미완료"
      const shouldComplete = state.some((todo) => !todo.completed);
      return state.map((todo) => ({ ...todo, completed: shouldComplete }));
    }

    // ── Exhaustive Check ────────────────────────────────────────
    // default가 없어도 TypeScript가 모든 case 처리를 컴파일 타임에 검증
    // TodoAction에 새 타입을 추가하면 여기서 빨간 줄 → 처리 강제
    // → 면접 포인트: "TypeScript로 exhaustive check 어떻게 하나요?"
  }
}

// ── Exhaustive Check ────────────────────────────────────────
// default가 없어도 TypeScript가 모든 case 처리를 컴파일 타임에 검증
// TodoAction에 새 타입을 추가하면 여기서 빨간 줄 → 처리 강제
// → 면접 포인트: "TypeScript로 exhaustive check 어떻게 하나요?"
