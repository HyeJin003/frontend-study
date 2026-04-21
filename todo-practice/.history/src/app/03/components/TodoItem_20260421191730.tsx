 'use client'

import { KeyboardEvent, useState } from 'react'
import { useTodoContext } from '../context'
// ─────────────────────────────────────────────────────────────
// TodoItem: 개별 Todo 항목
// 📖 정답: todo-100/src/app/03/components/TodoItem.tsx
//
// TODO [Step 4-C]:
//   ← 02번: onToggle, onDelete, onEdit 3개 props를 받았음
// 여기에선  isEditing 이 지금 수정중인가? 이런 의미임 
//   03번: todo만 받고 나머지는 Context에서 직접 꺼냄
//     <TodoItem todo={todo} />
//     const { toggleTodo, deleteTodo, editTodo } = useTodoContext()
// ─────────────────────────────────────────────────────────────

import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  // 여기에 useTodoContext() 사용 후 구현
  const {toggleTodo, deleteTodo,editTodo} = useTodoContext()
  const [isEditing, setIsEditing] =  useState<boolean>(false);  
  const [editText , setEditText ] =  useState <string>(todo.text);
  
  function handleEditConfirm ():void {
    const trimmed = editText.trim();
    if(trimmed === ''){
      deleteTodo(todo.id);
    
    }else{
      editTodo(todo.id , trimmed);
    }
    setIsEditing(false);
  }
  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
     if(event.key ==="Enter" && !event.nativeEvent.isComposing){
  handleEditConfirm()
     }
     if(event.key ==='Escape'){
      setEditText(todo.text)
      setIsEditing(false)
     }
  }
  
  return (
    


    <li><input type="checkbox" checked={todo.completed} 
    onChange={()=> toggleTodo(todo.id)}
    aria-label={`${todo.text}완료표시`}/>

{isEditing ? (<input type='text' value={editText} onChange={event =>setEditText(event.target.value)}
onKeyDown={handleEditConfirm}
onBlur={handleEditConfirm}
autoFocus
maxLength={200}

/>):(<span onDoubleClick={() => {setEditText(todo.text)
  setIsEditing(true)
}}
title='더블클릭하여 편집' 
className={`flex-1 cursor-pointer select-none text-sm ${todo.completed ? 'text-gray-400 line-through':'text-gray-800'}`}
>
{todo.text}

</span>
)}
    </li>
  )
}
