// ─────────────────────────────────────────────────────────────
// TodoEmpty: 빈 상태 UI
// 📖 정답: todo-100/src/app/03/components/TodoEmpty.tsx
//
// TODO [Step 4-A]:
//   ← 02번: message prop을 받았음
//   03번: useTodoContext()로 filter 꺼내서 메시지 직접 결정
//         props 없음!
// ─────────────────────────────────────────────────────────────

import { useTodoContext } from "../context"

export default function TodoEmpty() {
  // 여기에 useTodoContext() 사용 후 구현

  const {filter} = useTodoContext()

  const message = filter ==='active'? '진행중인 할일이 없어요!'
  :filter === 'completed' ? '완료된 할일이 없어요' : '할일을 추가해보세요'
  return (

    <div className="flex flex-col items-center gap-4 px-12 text-center">
      <div className="flex h-16 w-16 itemsa-center justify-center rounded-full bg-gray-100">
       <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
     <p className="text-sm text-gray-500">{message}</p>
    </div>




  ) 
  
  
  
}
