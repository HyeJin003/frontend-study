import type { Todo, TodoAction } from './types'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록
//   2. 어떤 상태가 바뀌나?          → 추가/토글/삭제/수정/전체완료/완료삭제/초기로드
//   3. 그 상태를 바꾸는 함수는?     → reducer 하나로 통합 (dispatch 통해 사용)
//   4. 타입을 어떻게 정의했나?      → TodoState (todos만 — filter는 context에서 useState)
//   5. 09번과 차이점?               → reducer 동일, context에서 useMemo가 추가됨
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useCallback을 reducer dispatch에 적용하는 게 의미가 있나요?"
//   A: "dispatch 자체는 useReducer가 이미 안정적인 참조를 보장합니다.
//       useCallback이 의미있는 건 dispatch를 감싸는 헬퍼 함수들입니다.
//       예: addTodo = useCallback((text) => dispatch({type:'ADD', text}), [dispatch])
//       이를 React.memo로 감싼 자식에 props로 내려줄 때 리렌더를 방지합니다."
//
// ─────────────────────────────────────────────────────────────

// filter는 context에서 useState로 별도 관리 → reducer에 포함하지 않음
export interface TodoState {
  todos: Todo[]
}

export const initialState: TodoState = {
  todos: [],
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, todos: action.todos }
    case 'ADD':
      return {
        ...state,
        todos: [
          { id: crypto.randomUUID(), text: action.text, completed: false, createdAt: Date.now() },
          ...state.todos,
        ],
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      }
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
      }
    case 'EDIT':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, text: action.text } : t
        ),
      }
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(t => !t.completed),
      }
    case 'TOGGLE_ALL': {
      const shouldComplete = state.todos.some(t => !t.completed)
      return {
        ...state,
        todos: state.todos.map(t => ({ ...t, completed: shouldComplete })),
      }
    }
    default:
      return state
  }
}
