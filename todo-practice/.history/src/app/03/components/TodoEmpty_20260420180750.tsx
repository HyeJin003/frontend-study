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

    <div className="flex flex-col items-center">
      <div>
        <svg>
          <path/>
        </svg>
      </div>
      <p>{message}</p>
    </div>




  ) 
  
  
  
}
