"use client";

import { KeyboardEvent, useState } from "react";

// ─────────────────────────────────────────────────────────────
// TodoInput: 새 할일 입력 컴포넌트
//
// ❓ 왜 'use client'가 필요한가?
//   → useState, 이벤트 핸들러(onChange, onKeyDown)는
//     브라우저에서만 동작 → 클라이언트 컴포넌트 필수
// ─────────────────────────────────────────────────────────────
interface TodoInputProps {
  onAdd: (text: string) => void;
}
export default function TodoInput({ onAdd }: TodoInputProps) {
  // ❓ 왜 input 값을 state로 관리하는가? (controlled input)
  //   → React가 input 값을 항상 알고 있어야 유효성 검사, 초기화 가능
  //   → value={text} + onChange 쌍이 없으면 uncontrolled (19번 비교)

  const [text, setText] = useState("");

  function handleAdd(): void {
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }
    onAdd(trimmed);
    setText("");
  }

  // ❓ onKeyDown vs onKeyPress?
  //   → onKeyPress는 deprecated (표준에서 제거됨)
  //   → onKeyDown: 모든 키 입력 감지 (권장)
  // React가 브라우저 이벤트를 감싸서 편하게 쓰게 해준다는 말
  // nativeEvent는 그냥 "브라우저한테 직접 물어봄" 정도로 이해하면 돼.
  //isComposing이 브라우저에 있는 값이라 꺼내 쓰는 것.
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      if (event.nativeEvent.isComposing) {
        return;
        handleAdd();
      }
    }
  }
  return (
    <div className="flex gap-2">
      ff
      <input
        type="text"
        value={text}
        onChange={(event) => event.target.value}
        maxLength={200}
        aria-label="새할일 입력"
        placeholder="할일을 입력하세요...."
      />
      <button>추가</button>
    </div>
  );
}
