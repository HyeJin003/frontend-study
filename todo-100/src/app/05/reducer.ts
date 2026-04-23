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
