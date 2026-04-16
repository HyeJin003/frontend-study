// ─────────────────────────────────────────────────────────────
// TodoItem: 개별 Todo 항목
//
// 이 컴포넌트가 하는 일:
//   1. 완료 체크박스
//   2. 텍스트 표시 (더블클릭 시 편집 모드)
//   3. 삭제 버튼
// ─────────────────────────────────────────────────────────────

import { Todo } from "@/app/01/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}
export default function TodoItem() {
  return <></>;
}
