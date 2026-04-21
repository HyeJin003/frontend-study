'use client'

import { KeyboardEvent, useState } from "react";
import { useTodoContext } from "../context"
import Button from "@/components/ui/Button";

// ─────────────────────────────────────────────────────────────
// TodoInput: 새 할일 입력 컴포넌트
// 📖 정답: todo-100/src/app/03/components/TodoInput.tsx
//
// TODO [Step 4-B]:
//   ← 02번: onAdd prop을 받았음
//     function TodoInput({ onAdd }: { onAdd: (text: string) => void })
//
//   03번: props 없이 Context에서 직접 꺼냄
//     const { addTodo } = useTodoContext()
// ─────────────────────────────────────────────────────────────

export default function TodoInput() {
  // 여기에 useTodoContext() 사용 후 구현
  const {addTodo} = useTodoContext();
  const [text, setText] = useState<string>('')

 function handleAdd():void {
  const trimmed = text.trim();
  if(trimmed ===''){
    return
  }
  addTodo(trimmed);
  setText('');
 }

 function handleKeyDown (event:KeyboardEvent<HTMLInputElement>):void{
if(event.key ==='Enter'){
  if(event.nativeEvent.isComposing){
    return
  }
  handleAdd
}
 }
  return (
  <div className="flex gap-2">
    <input type="text"  onChange={event => setText(event?.target.value)} 
    value={text} onKeyDown={handleKeyDown}  maxLength={200} className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
    placeholder="할일을 입력하세요..."/>

<Button>추가</Button>

  </div>
  )
 
}
