"use client";

// ═══════════════════════════════════════════════════════════════
// 02번 연습: useReducer
// 🎯 목표: useState → useReducer로 상태 관리 방식 변경
// 📖 정답: todo-100/src/app/02/page.tsx
// ═══════════════════════════════════════════════════════════════
//
// 🟢 Step 3: reducer.ts 완성 후 이 파일에서 dispatch 연결
//
// ── 핵심 변화 ────────────────────────────────────────────────
//
//   01번: const [todos, setTodos] = useState<Todo[]>([])
//   02번: const [todos, dispatch] = useReducer(todoReducer, [])
//
//   01번: setTodos(prev => [newTodo, ...prev])   ← "어떻게"
//   02번: dispatch({ type: 'ADD', payload: { text } })  ← "무엇을"
//
// ── 이미 완성된 것 (건드리지 않아도 됨) ──────────────────────
//   - useReducer 선언
//   - filteredTodos, activeCount, completedCount 계산
//   - JSX 전체
//
// ── 여러분이 할 것 ────────────────────────────────────────────
//   - 각 함수 안에 dispatch 호출 채우기 (TODO Step 3-A ~ 3-E)
//
// ═══════════════════════════════════════════════════════════════

import { useReducer, useState } from "react";
import Link from "next/link";
import type { Todo, FilterType } from "./types";
import { todoReducer } from "./reducer";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoEmpty from "./components/TodoEmpty";
import TodoFooter from "./components/TodoFooter";

export default function TodoPage() {
  // ← 01번: const [todos, setTodos] = useState<Todo[]>([])
  const [todos, dispatch] = useReducer(todoReducer, [] as Todo[]);

  const [filter, setFilter] = useState<FilterType>("all");

  // TODO [Step 3-A]: dispatch({ type: 'ADD', payload: { text } }) 로 교체
  // ← 01번: setTodos(prev => [{ id: crypto.randomUUID(), ...}, ...prev])
  function addTodo(text: string): void {
    // 여기에 dispatch 호출
    dispatch({ type: "ADD", payload: { text } });
  }

  // TODO [Step 3-B]: dispatch({ type: 'TOGGLE', payload: { id } })
  // ← 01번: setTodos(prev => prev.map(t => ...))
  function toggleTodo(id: string): void {
    // 여기에 dispatch 호출
    dispatch({ type: "TOGGLE", payload: { id } });
  }

  // TODO [Step 3-C]: dispatch({ type: 'DELETE', payload: { id } })
  function deleteTodo(id: string): void {
    // 여기에 dispatch 호출
    dispatch({ type: "DELETE", payload: { id } });
  }

  // TODO [Step 3-D]: dispatch({ type: 'EDIT', payload: { id, text } })
  function editTodo(id: string, text: string): void {
    // 여기에 dispatch 호출
    dispatch({ type: "EDIT", payload: { id, text } });
  }

  // TODO [Step 3-E]: dispatch({ type: 'CLEAR_COMPLETED' })
  function clearCompleted(): void {
    // 여기에 dispatch 호출
    dispatch({ type: "CLEAR_COMPLETED" });
  }

  // TODO [Step 3-F]: dispatch({ type: 'TOGGLE_ALL' })
  function toggleAll(): void {
    // 여기에 dispatch 호출
    dispatch({ type: "TOGGLE_ALL" });
  }

  // ── 파생 데이터 (01번과 동일) ───────────────────────────────
  const filteredTodos: Todo[] = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        ← 목록으로
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
            02
          </span>
          <h1 className="text-2xl font-bold text-gray-900">
            useReducer — 연습
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          순서: types.ts → reducer.ts → page.tsx dispatch 연결
        </p>
      </div>

      <TodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeCount === 0}
            onChange={toggleAll}
            id="toggle-all"
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-500"
          />
          <label
            htmlFor="toggle-all"
            className="cursor-pointer text-sm text-gray-600"
          >
            전체 {activeCount === 0 ? "미완료로 변경" : "완료로 변경"}
          </label>
        </div>
      )}

      <div className="mt-4">
        {filteredTodos.length === 0 ? (
          <TodoEmpty
            message={
              filter === "active"
                ? "진행 중인 할일이 없어요!"
                : filter === "completed"
                  ? "완료된 할일이 없어요!"
                  : "할일을 추가해보세요!"
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="mt-4">
          <TodoFooter
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        </div>
      )}
    </div>
  );
}
