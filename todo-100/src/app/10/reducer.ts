import type { Todo, TodoAction } from './types'

// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   reducer 자체는 09번과 동일.
//   10번의 핵심 변화는 page.tsx에서 컴포넌트를 React.memo로 감싸는 것.
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "React.memo는 언제 효과가 없나요?"
//   A: "① props로 새 객체/배열/함수를 매 렌더마다 생성해 넘기면 효과 없음.
//          → useCallback / useMemo로 안정화해야 함.
//       ② children이 JSX면 항상 새 참조 → memo 우회됨.
//       ③ 컴포넌트 자체에 내부 상태가 있으면 그 상태 변경은 memo와 무관하게 리렌더."
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
