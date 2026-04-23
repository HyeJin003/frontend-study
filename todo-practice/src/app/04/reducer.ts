// ─────────────────────────────────────────────────────────────
// 04번 연습: reducer.ts
// 📖 정답: todo-100/src/app/04/reducer.ts
//
// 🔴 Step 2: types.ts 완성 후 작성하세요
//
// ❓ 생각해보기:
//   - 02번 reducer.ts와 무엇이 다른가요?
//   - TodoState에 filter가 포함된 이유는?
//   - SET_FILTER 케이스는 어떻게 구현하나요?
//
// 💡 무엇을 넣어야 할지 고민하는 법:
//   1. reducer가 관리할 상태는?          → todos + filter
//   2. 각 액션이 state를 어떻게 바꾸나? → ADD/TOGGLE/DELETE/EDIT/CLEAR/TOGGLEALL/SETFILTER
//   3. 초기값은?                         → todos: [], filter: 'all'
// ─────────────────────────────────────────────────────────────

import type { Todo, FilterType, TodoAction } from './types'

// TODO [Step 2-A]: TodoState 인터페이스를 정의하세요
// 힌트: todos + filter
export interface TodoState {
  todos:Todo[],
  filter:FilterType
}
// TODO [Step 2-B]: initialState를 정의하세요 
export const initialState: TodoState = {
  todos:[],
  filter:'all',
}
// TODO [Step 2-C]: todoReducer를 구현하세요

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
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
      }
    case 'EDIT':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, text: action.text } : todo
        ),
      }
      case 'CLEAR_COMPLETED':
        return {
          ...state,
          todos:state.todos.filter(todo=>!todo.completed),
        }
        case 'TOGGLE_ALL':{
          const shouldComplete = state.todos.some(todo =>!todo.completed)
          return{
            ...state, 
            todos:state.todos.map(todo=>({...todo, completed:shouldComplete}))
          }
        }
          case 'SET_FILTER':
      return { ...state, filter: action.filter }
    default:
      return state
  }
    }
  