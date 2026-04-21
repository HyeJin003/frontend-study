'use client'

import { useTodoContext } from "../context"

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
  const {text, setText} =  useState<string>('');
  return <div />
}
