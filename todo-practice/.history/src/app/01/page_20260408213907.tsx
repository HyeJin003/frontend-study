"use client";

// ═══════════════════════════════════════════════════════════════
// 01번 연습: useState 기본
// 🎯 목표: useState만으로 Todo CRUD + 필터 + 편집 완성
// 📖 정답: todo-100/src/app/01/page.tsx 참고
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import type { Todo, FilterType } from "./types";

// TODO: TodoInput, TodoItem, TodoEmpty, TodoFooter 컴포넌트 import
// 힌트: components/ 폴더를 직접 만들고 정답 참고해서 작성

export default function TodoPage() {
  // TODO 1: todos 상태를 선언하세요
  // 힌트: useState<Todo[]>([])
  // ❓ 왜 <Todo[]>를 붙여야 하는가?
  const [todos, setTodos] = useState<Todo[]>([]);

  // TODO 2: filter 상태를 선언하세요
  // 힌트: useState<FilterType>('all')
  const [filter, setFilter] = useState<FilterType>("all");
  // TODO 3: addTodo 함수를 작성하세요
  // 요구사항:
  //   - crypto.randomUUID()로 id 생성
  //   - completed: false 로 시작
  //   - 최신 항목이 위에 오도록 추가 (앞에 추가)
  function addTodo(text: string): void {
    // 여기에 작성
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    // 새 항목을 앞에 추가
    setTodos((prev) => [newTodo, ...prev]);
  }

  // TODO 4: toggleTodo 함수를 작성하세요
  // 요구사항: id에 해당하는 todo의 completed를 반전
  function toggleTodo(id: string): void {
    // 여기에 작성  이건 클릭 전: ☐ 운동하기  (completed:false ) 클릭 후: ☑ 운동하기  (completed:true)
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo,completed :!to } )
  }

  // TODO 5: deleteTodo 함수를 작성하세요
  // 요구사항: id에 해당하는 todo를 배열에서 제거
  function deleteTodo(id: string): void {
    // 여기에 작성
  }

  // TODO 6: editTodo 함수를 작성하세요
  // 요구사항: id에 해당하는 todo의 text를 변경
  function editTodo(id: string, text: string): void {
    // 여기에 작성
  }

  // TODO 7: clearCompleted 함수를 작성하세요
  // 요구사항: completed === true 인 항목 모두 제거
  function clearCompleted(): void {
    // 여기에 작성
  }

  // TODO 8: filteredTodos를 계산하세요
  // 힌트: todos.filter() 사용
  // ❓ 왜 state가 아닌 계산값으로 만드는가?
  const filteredTodos: Todo[] = []; // 여기를 수정하세요

  // TODO 9: activeCount, completedCount를 계산하세요
  const activeCount = 0; // 여기를 수정하세요
  const completedCount = 0; // 여기를 수정하세요

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">01. useState 기본 — 연습</h1>
      {/* TODO 10: TodoInput 컴포넌트를 추가하세요 */}
      {/* 힌트: <TodoInput onAdd={addTodo} /> */}
      {/* TODO 11: 리스트를 렌더링하세요 */}
      {/* 조건:
          - filteredTodos가 비어있으면 TodoEmpty 표시
          - 비어있지 않으면 filteredTodos.map()으로 TodoItem 렌더링
          - key는 반드시 todo.id 사용 */}
      fileterTodo
      {/* TODO 12: TodoFooter를 추가하세요 */}
      {/* 힌트: todos.length > 0 일 때만 표시 */}
    </div>
  );
}
