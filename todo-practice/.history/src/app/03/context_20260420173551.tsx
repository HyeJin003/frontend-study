'use client'

// ═══════════════════════════════════════════════════════════════
// 03번 연습: Context 정의
// 📖 정답: todo-100/src/app/03/context.tsx
// ═══════════════════════════════════════════════════════════════
//
// 🟡 Step 2: types.ts 완성 후 이 파일을 작성하세요
//
// ❓ 생각해보기:
//   - prop drilling이 뭔가요? 왜 문제인가요?
//   - createContext(null) 왜 null로 초기화하나요?
//   - useTodoContext에서 null 체크를 왜 하나요?
//
// 작성 순서:
//   1. TodoContextValue 인터페이스 정의
//   2. TodoContext = createContext<TodoContextValue | null>(null)
//   3. TodoProvider 컴포넌트 (useState + 함수들 + Provider)
//   4. useTodoContext 커스텀 훅 (null 체크 포함)
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Todo, FilterType } from './types'

// TODO [Step 2-A]: TodoContextValue 인터페이스를 정의하세요
//   todos, filter, filteredTodos, activeCount, completedCount
//   addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, toggleAll, setFilter
interface TodoContextValue {
  
  todos:Todo[]
  filter:FilterType
  filteredTodos:Todo[]
  activeCount:number
  completedCount:number
  addTodo: (text:string) => void
  toggleTodo:(id:string)  => void
  deleteTodo: (id: string) => void
  editTodo:(id:string , text:string) =>void
  clearCompleted : () =>void
  toggleAll:()=>void
  setFilter:(filter:FilterType) => void
}

// TODO [Step 2-B]: Context를 생성하세요
// 힌트: createContext<TodoContextValue | null>(null)
const TodoContext = createContext<TodoContextValue | null>(null)

// TODO [Step 2-C]: TodoProvider를 구현하세요
// 02번 page.tsx에 있던 상태와 함수들을 여기로 옮기면 됩니다
//
// 💡 Provider에 뭘 넣어야 할지 고민하는 법:
//   1. 화면에 뭘 보여줘야 하나?    → todos, filteredTodos, activeCount, completedCount
//   2. 어떤 상태가 바뀌나?         → filter 바꾸기, todo 추가/삭제/수정
//   3. 그 상태를 바꾸는 함수는?    → addTodo, toggleTodo, deleteTodo, editTodo...
//   → "자식 컴포넌트들이 필요한 것 목록" = Provider value에 넣을 것
//
// stub: 구현 전까지 빈 값으로 에러 없이 렌더되게 함
const stubValue: TodoContextValue = {
  todos: [], filter: 'all', filteredTodos: [], activeCount: 0, completedCount: 0,
  addTodo: () => {}, toggleTodo: () => {}, deleteTodo: () => {}, editTodo: () => {},
  clearCompleted: () => {}, toggleAll: () => {}, setFilter: () => {},
}

export function TodoProvider({ children }: { children: ReactNode }) {
  // 여기에 작성 (stub이 있어서 일단 화면은 뜸)

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');


function addTodo(text:string):void{
  setTodos (prev =>[{id:crypto.randomUUID(), text, completed:false, createdAt:Date.now()},
 ...prev,
  ])
}

  function toggleTodo(id:string):void{
setTodos (prev => prev.map(todo => (todo.id === id ? {...todo,completed:!todo.completed}:todo)))
  }
 
function deleteTodo(id:string):void{
setTodos(prev => prev.filter(todo=> todo.id !== id))
}
function editTodo(id:string, text:string):void{
setTodos(prev => prev.map(todo => (todo.id === id ?{...todo,text}:todo)))

}
function clearCompleted():void{
  setTodos(prev=>prev.filter(todo =>!todo.completed))

}
function toggleAll():void{
  const shouldComplete =  todos.some(todo =>!todo.completed)
  setTodos(prev =>prev.map(todo => ({...todo,completed:shouldComplete})))

}
const filteredTodos = todos.filter(todo => {
   if(filter === 'active') {
    return !todo.completed;
   }
   if(filter === 'completed'){
    return todo.completed
   }
   return true;
})
const activeCount = todos.filter(todo =>!todo.completed).length
const completedCount = todos.filter (todo=>todo.completed).length



  return <TodoContext.Provider value={{todos, filter,
    filteredTodos,activeCount,completedCount,
    addTodo,toggleTodo,deleteTodo,editTodo,
    clearCompleted,toggleAll,setFilter}}>{children}</TodoContext.Provider>
}

// TODO [Step 2-D]: useTodoContext 커스텀 훅을 만드세요
// 힌트: useContext(TodoContext) → null 체크 → return ctx
export function useTodoContext(): TodoContextValue {
  // 여기에 작성
  const context = useContext(TodoContext)
  if(!context) {
    throw new Error ('useTodoContext는 TodoProvider 안에서만 사용할 수 있습니다')
  }
  return useContext(TodoContext) ?? stubValue
}
