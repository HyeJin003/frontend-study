// ─────────────────────────────────────────────────────────────
// 04번 연습: types.ts
// 📖 정답: todo-100/src/app/04/types.ts
//
// 🔴 Step 1: 가장 먼저 작성하세요
//
// ❓ 생각해보기:
//   - 03번 types.ts와 무엇이 다른가요?
//   - TodoAction에 왜 SET_FILTER가 추가됐나요?
//   - useReducer를 쓰면 filter도 reducer가 관리해야 하는 이유는?
//
// 💡 무엇을 넣어야 할지 고민하는 법:
//   1. 화면에 뭘 보여줘야 하나?     → Todo 타입 필요
//   2. 어떤 상태가 바뀌나?          → 추가/토글/삭제/수정/전체완료/완료삭제/필터
//   3. reducer가 받을 액션은?       → TodoAction (모든 변경 케이스)
//   4. 03번과 차이?                 → SET_FILTER 액션 추가
// ─────────────────────────────────────────────────────────────

// TODO [Step 1-A]: Todo 인터페이스를 정의하세요 (03번과 동일)
export interface Todo {
    id:string;
    text:string;
    completed:boolean;
    createdAt:number;
}
// TODO [Step 1-B]: FilterType을 정의하세요 (03번과 동일)
export type FilterType = 'all' | 'active' | 'completed'
// TODO [Step 1-C]: TodoAction을 정의하세요
// 힌트: 02번 액션에 SET_FILTER 추가
// set_filter 만 타입 지정 하는 이유가 
// CLEAR_COMPLETED에 왜 데이터가 없냐? "완료된거 다 지워줘 라는 의미라 추가 정보가 필요 없다"
export type TodoAction = 
|{type:'ADD', text:string}
|{type:'TOGGLE', id:string}
|{type:'DELETE', id:string}
|{type:'EDIT', id:string ;text:string}
|{type:'CLEAR_COMPLETED'}
|{type:'TOGGLE_ALL'}
|{type:'SET_FILTER',filter:FilterType}
