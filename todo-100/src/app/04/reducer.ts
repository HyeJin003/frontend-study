import type { Todo, FilterType, TodoAction } from './types'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, filter 상태
//   2. 어떤 상태가 바뀌나?          → 추가/토글/삭제/수정/전체완료/완료삭제/필터변경
//   3. 그 상태를 바꾸는 함수는?     → reducer 하나로 통합
//   4. 타입을 어떻게 정의했나?      → TodoState로 todos+filter 묶음
//   5. 02번과 차이점?               → filter도 reducer가 관리 (SET_FILTER 추가)
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "03번과 04번의 차이가 뭔가요?"
//   A: "03번은 useState로 상태를 관리하고 함수를 Context에 넣었고,
//       04번은 useReducer로 모든 상태를 통합하고 dispatch만 Context에 넣었습니다.
//       dispatch는 렌더마다 새로 생기지 않아서 불필요한 리렌더를 줄일 수 있습니다."
// ─────────────────────────────────────────────────────────────

export interface TodoState {
  todos: Todo[]
  filter: FilterType
}

export const initialState: TodoState = {
  todos: [],
  filter: 'all',
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
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
    // ← 03번에 없던 액션: filter도 reducer가 관리
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}
