'use client'

// ═══════════════════════════════════════════════════════════════
// 04번 연습: Context 정의
// 📖 정답: todo-100/src/app/04/context.tsx
// ═══════════════════════════════════════════════════════════════
//
// 🟡 Step 3: reducer.ts 완성 후 이 파일을 작성하세요
//
// ❓ 생각해보기:
//   - 03번 context.tsx와 무엇이 다른가요?
//   - Context를 왜 두 개로 나누나요?
//   - dispatch는 왜 리렌더를 일으키지 않나요?

//   filteredTodos— 화면에 실제로 보여줄 목록      
//  completedCount — 완료된 개수      
//
// 💡 무엇을 넣어야 할지 고민하는 법:
//   1. 화면에 뭘 보여줘야 하나?          → TodoStateContext
//   2. 어떤 동작이 있나?                 → TodoDispatchContext
//   3. 왜 분리하나?                      → dispatch만 쓰는 컴포넌트 리렌더 방지
//   4. 커스텀 훅은 몇 개?               → useTodoState + useTodoDispatch
//   → Context 두 개로 분리 = 리렌더 최적화
//
// 작성 순서:
//   1. TodoStateValue 인터페이스 정의
//   2. TodoStateContext, TodoDispatchContext 생성
//   3. TodoProvider (useReducer + 두 Provider 중첩)
//   4. useTodoState, useTodoDispatch 커스텀 훅
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Todo, FilterType, TodoAction } from './types'
import { todoReducer, initialState } from './reducer'

// TODO [Step 3-A]: TodoStateValue 인터페이스를 정의하세요
interface TodoStateValue {
  todos: Todo[]
  filter: FilterType
  filteredTodos: Todo[]
  activeCount: number
  completedCount: number
}

// TODO [Step 3-B]: 두 개의 Context를 생성하세요

const TodoStateContext = createContext<TodoStateValue | null>(null);
const TodoDispatchContext = createContext<Dispatch<TodoAction> | null>(null);
// stub: 구현 전까지 에러 없이 렌더되게 함
const stubDispatch: Dispatch<TodoAction> = () => {}

// TODO [Step 3-C]: TodoProvider를 구현하세요
export function TodoProvider({ children }: { children: ReactNode }) {
  // 여기에 작성
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const filteredTodos =  state.todos.filter(todo => {
    if(state.filter === "active"){
      return !todo.completed
    }
    if(state.filter === 'completed'){
      return todo.completed
    }
    return true
  })
  
  const activeCount = state.todos.filter(t => !t.completed).length
  const completedCount = state.todos.filter(t => t.completed).length


 const stateValue: TodoStateValue = {
    todos: state.todos,
    filter: state.filter,
    filteredTodos,
    activeCount,
    completedCount,
  }
  return (
   <TodoStateContext.Provider value={stateValue}>
<TodoDispatchContext.Provider value={dispatch}>
{children}
</TodoDispatchContext.Provider>
</TodoStateContext.Provider>
  )
}
// ── 4. 커스텀 훅 두 개 ────────────────────────────────────────
export function useTodoState(): TodoStateValue {
  const ctx = useContext(TodoStateContext)
  if (!ctx) throw new Error('useTodoState는 TodoProvider 안에서만 사용 가능')
  return ctx
}

export function useTodoDispatch(): Dispatch<TodoAction> {
  const ctx = useContext(TodoDispatchContext)
  if (!ctx) throw new Error('useTodoDispatch는 TodoProvider 안에서만 사용 가능')
  return ctx
}
