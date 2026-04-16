// ─────────────────────────────────────────────────────────────
// TodoItem: 개별 Todo 항목
//
// 이 컴포넌트가 하는 일:
//   1. 완료 체크박스
//   2. 텍스트 표시 (더블클릭 시 편집 모드)
//   3. 삭제 버튼
// ─────────────────────────────────────────────────────────────

import { Todo } from "@/app/01/types";
import { KeyboardEvent, useState } from "react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}
export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  //편집 모드 여부
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // 편집 중인 임시 텍스트 (확정 전까지 원본 건드리지 않음)
  const [editText, setEditText] = useState<string>(todo.text);

  function handleEditConfirm(): void {
    const trimmed = editText.trim();
    if (trimmed === "") {
      onDelete(todo.id);
    } else {
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  }

  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      handleEditConfirm();
    }
    if (event.key === "Escape") {
      // ESC: 편집 취소 → 원본 텍스트 복원
      setEditText(todo.text);
      setIsEditing(false);
    }
  }
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"></li>
  );
}
