import type { Todo, TodoAction } from './types'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → todos 목록
//   2. 어떤 상태가 바뀌나?          → ADD/TOGGLE/DELETE/EDIT 등
//   3. 그 상태를 바꾸는 함수는?     → reducer 하나로 통합
//   4. filter는?                    → context에서 useState로 별도 관리
//   5. 08번과 차이점?               → reducer 동일, context에서 useMemo 추가됨
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useMemo와 useCallback의 차이가 뭔가요?"
//   A: "useCallback은 함수 자체를 메모이제이션하고,
//       useMemo는 함수의 반환값(계산 결과)을 메모이제이션합니다.
//       useCallback(fn, deps) === useMemo(() => fn, deps) 와 동일합니다."
//
// ─────────────────────────────────────────────────────────────

export interface TodoState {
  todos: Todo[]
}

export const initialState: TodoState = {
  todos: [],
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'LOAD':
      return { todos: action.todos }
    case 'ADD':
      return {
        todos: [
          { id: crypto.randomUUID(), text: action.text, completed: false, createdAt: Date.now() },
          ...state.todos,
        ],
      }
    case 'TOGGLE':
      return {
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      }
    case 'DELETE':
      return {
        todos: state.todos.filter(t => t.id !== action.id),
      }
    case 'EDIT':
      return {
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, text: action.text } : t
        ),
      }
    case 'CLEAR_COMPLETED':
      return {
        todos: state.todos.filter(t => !t.completed),
      }
    case 'TOGGLE_ALL': {
      const shouldComplete = state.todos.some(t => !t.completed)
      return {
        todos: state.todos.map(t => ({ ...t, completed: shouldComplete })),
      }
    }
    default:
      return state
  }
}
