// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록, filter 상태
//   2. 어떤 상태가 바뀌나?          → 04번 동일 + localStorage 불러오기(LOAD)
//   3. 그 상태를 바꾸는 함수는?     → reducer (LOAD 케이스 추가)
//   4. 타입을 어떻게 정의했나?      → 04번 TodoState 동일, TodoAction에 LOAD 추가
//   5. initialState가 빈 배열인 이유? → localStorage 로딩은 useEffect에서 담당
//                                       reducer는 순수함수 → 외부 접근 금지
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "왜 initialState에서 localStorage를 읽지 않나요?"
//   A: "reducer는 순수함수여야 합니다. localStorage는 외부 상태(side effect)이므로
//       useEffect에서 마운트 시 한 번 읽어 LOAD 액션으로 dispatch합니다."
//
// ─────────────────────────────────────────────────────────────

import type { Todo, FilterType, TodoAction } from './types'

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
    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      }
    case 'EDIT':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, text: action.text } : t
        ),
      }
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) }
    case 'TOGGLE_ALL': {
      const shouldComplete = state.todos.some(t => !t.completed)
      return { ...state, todos: state.todos.map(t => ({ ...t, completed: shouldComplete })) }
    }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}
