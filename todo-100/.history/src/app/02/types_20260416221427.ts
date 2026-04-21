// ═══════════════════════════════════════════════════════════════
// 02번: useReducer — 타입 정의
// ═══════════════════════════════════════════════════════════════
//
// ── 실무 개발 순서 ──────────────────────────────────────────────
//
//   🔴 Step 1: types.ts  → 데이터 구조 + 액션 목록 합의  ← 지금 여기
//   🟡 Step 2: reducer.ts → 순수 로직 구현
//   🟢 Step 3: page.tsx   → useReducer로 연결
//
//   왜 타입부터? → 타입이 확정되면 IDE 자동완성이 나머지를 안내해줌
//                  "이 앱에서 뭘 할 수 있나"를 팀과 먼저 합의하는 과정
//
// ── Discriminated Union (판별 유니온) ──────────────────────────
//
//   공통 필드(type)로 타입을 좁혀주는 패턴.
//   switch(action.type)에서 TypeScript가 각 case의 payload 타입을 자동 추론:
//
//
//   case 'ADD':    → action.payload.text  접근 가능
//   case 'DELETE': → action.payload.id    접근 가능
//   case 'EDIT':   → action.payload.id + action.payload.text 접근 가능
//
//   다른 case에서 잘못된 필드 접근 시 컴파일 에러로 즉시 발견.
//   → 면접 포인트: "TypeScript의 타입 좁힘(Type Narrowing)이 뭔가요?"
//
// ═══════════════════════════════════════════════════════════════

// 01번과 동일 — 상태 관리 방식이 바뀌어도 데이터 모델은 독립적
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = "all" | "active" | "completed";

// ── TodoAction: 앱에서 발생 가능한 모든 사건 목록 ──────────────
//
// ❓ 왜 payload 중첩 구조인가? ({ type: 'ADD'; text: string } 아닌 이유)
//   → Redux 표준 구조 (FSA: Flux Standard Action)
//   → 미들웨어(redux-logger, redux-saga 등)가 payload 위치를 가정하고 동작
//   → meta, error 같은 추가 필드를 같은 레벨에 붙이기 좋음
//   → redux-toolkit이 이 구조를 강제함 → 미리 익혀두면 이직/협업 시 유리
//
// ❓ CLEAR_COMPLETED / TOGGLE_ALL 에 payload가 없는 이유
//   → "어떤 항목을 지울지"는 reducer가 state를 보고 결정 (id 목록 필요 없음)
//   → "완료 or 미완료"도 reducer가 state.some()으로 판단
//   → payload에 필요한 정보만 담는다 — 과하게 넘기지 않는다
export type TodoAction =
  | { type: "ADD"; payload: { text: string } }
  | { type: "TOGGLE"; payload: { id: string } }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "EDIT"; payload: { id: string; text: string } }
  | { type: "CLEAR_COMPLETED" }
  | { type: "TOGGLE_ALL" };
