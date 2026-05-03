"use client";

// ╔═══════════════════════════════════════════════════════════════╗
// ║  📗 챕터 1 — 기초 상태 관리 (01~02번)                        ║
// ╚═══════════════════════════════════════════════════════════════╝
//
// ── 모든 챕터 공통: 파일 읽는 순서 ───────────────────────────
//
//   types.ts → hooks.ts(06~) → reducer.ts(02~) → context.tsx(03~) → page.tsx → components/
//
//   왜 이 순서인가:
//   - types.ts 먼저: 나머지 파일의 타입이 눈에 들어옴
//   - page.tsx 마지막: "연결 결과"는 "설계 이유"를 이해한 뒤 봐야 함
//   - components/ 마지막: "무엇을 받는지"는 설계 완료 후 확인
//
// ── 모든 챕터 공통: 주석 읽는 법 ────────────────────────────
//
//   // ← 04번: ~   → 이전 버전과 달라진 지점. "왜 바꿨나?" 생각하고 읽을 것
//   // ── 설계할 때 한 고민   → 각 번호 1~5 앞에서 "나라면 어떻게 했을까?" 먼저 생각
//   // ── 면접 포인트 Q/A    → 소리 내어 읽을 것. 암기 말고 이해.
//   // 왜 ~인가?             → 납득될 때까지 멈출 것. 넘어가지 말 것.
//   // ❌ / ✅               → 둘의 차이를 말로 설명해볼 것
//
//   ❌ 코드를 눈으로 쭉 훑고 "이해했다" 하고 넘어가기
//   ✅ "왜?" 주석 앞에서 멈추고, 납득하고, 다음 줄
//
// ── 모든 챕터 공통: 이해 안 되면 문서에서 찾기 ───────────────
//
//   React 공식 → https://react.dev/reference/react/훅이름  (주소창에 직접 입력)
//   MDN       → Google에서 "MDN 찾는것" 검색
//
//   문서 읽는 순서:
//   1. 맨 위 한 줄 요약 (이 훅이 뭔지)
//   2. "Usage" 섹션 (실제 사용 예시)
//   3. "Deep Dive" 박스 (내부 동작 원리 — 면접 A+ 소재)
//   4. "Troubleshooting" 섹션 (흔한 실수 — 면접 단골)
//
// ── 모든 챕터 공통: 컴포넌트 설계 기준 ──────────────────────
//
//   컴포넌트에 뭘 넣을지 모를 때 이 순서로 생각:
//   1. 화면에 그리는 게 뭔가?      → 그것만 보여주면 됨
//   2. 필요한 데이터가 뭔가?       → 그것만 props/context로 받으면 됨
//   3. 일어나는 동작이 뭔가?       → 그 동작의 함수만 받으면 됨
//   4. 필요 없는 건 절대 받지 않기 → 안 쓰는 props 넣지 말 것
//
//   예시:
//   TodoItem   → todo + onToggle + onDelete + onEdit
//   TodoEmpty  → filter  (todos 배열 전체 불필요 — 메시지만 보여주면 됨)
//   TodoFooter → activeCount + completedCount + filter + onFilterChange + onClearCompleted
//
// ── 모든 챕터 공통: 코드 작성 규칙 ──────────────────────────
//
//   - any 절대 금지 — 정확한 타입 정의할 것
//   - 주석에는 "무엇(what)"이 아닌 "왜(why)"를 적을 것
//   - 새 번호 = 이전 버전의 리팩토링 형태 (01 → 02 → 03 개선)
//
// ─────────────────────────────────────────────────────────────
// 📗 챕터 1 — 기초 상태 관리 (01~02번)
// ─────────────────────────────────────────────────────────────
//
// 이 챕터 읽는 순서:
//   01번: types.ts → page.tsx → components/
//   02번: types.ts → reducer.ts → page.tsx → components/
//
// 이 챕터 React 문서:
//   react.dev/reference/react/useState
//   react.dev/reference/react/useReducer → "Deep Dive: Writing reducers well" 필독
//
// 이 챕터에서 생각해볼 것:
//   - "왜 배열을 직접 수정하지 않고 새 배열을 만드나?" (불변성)
//   - "useReducer를 쓰면 useState보다 뭐가 좋아지나?"
//   - reducer의 각 case가 왜 새 배열/객체를 반환하는지 납득할 것
//   - "dispatch({ type: 'ADD' })가 직접 setTodos보다 나은 이유는?"
//
// ═══════════════════════════════════════════════════════════════
// 01번: useState 기본
// ═══════════════════════════════════════════════════════════════
//
// 이전 버전: 없음 (시작점)
// 이번 버전: useState 만으로 Todo CRUD + 필터 + 편집 완성
//
// ── 핵심 개념 ────────────────────────────────────────────────
//
// 1. useState<T>(초기값) → [현재값, setter함수] 반환
//    - T 타입을 명시해야 타입 추론이 정확함
//    - setter를 직접 호출해야만 리렌더 발생
//
// 2. 불변성(Immutability) — React의 핵심 원칙
//    ❌ todos.push(newTodo)      → 같은 배열 주소 → 리렌더 없음
//    ✅ [...todos, newTodo]      → 새 배열 생성 → 리렌더 발생
//
// 3. 함수형 업데이트: setTodos(prev => ...)
//    → prev는 항상 최신 상태를 보장
//    → 비동기 상황에서도 안전 (클로저 문제 방지)
//
// ── 이 버전의 한계 (다음 버전에서 해결) ─────────────────────
//    - 상태가 많아지면 useState가 여러 개 → 관리 힘듦
//    - 새로고침하면 데이터 사라짐 (07번: localStorage로 해결)
//    - 상태 로직이 컴포넌트에 섞여있음 (05번: 커스텀훅으로 해결)
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import Link from "next/link";
import type { Todo, FilterType } from "./types";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoEmpty from "./components/TodoEmpty";
import TodoFooter from "./components/TodoFooter";

export default function TodoPage() {
  // ── 상태 선언 ──────────────────────────────────────────────
  //
  // ❓ 왜 <Todo[]>를 명시하는가?
  //   → useState([]) 만 쓰면 TypeScript가 never[]로 추론
  //   → never[] = 아무것도 넣을 수 없는 배열 → 에러 발생
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  // ── CRUD 함수들 ────────────────────────────────────────────

  function addTodo(text: string): void {
    // ❓ crypto.randomUUID()를 쓰는 이유
    //   → Date.now(): 같은 밀리초에 두 개 추가하면 중복 ID 발생
    //   → Math.random(): 이론상 충돌 가능 (1/2^52)
    //   → crypto.randomUUID(): RFC 4122 표준, 충돌 확률 거의 0
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    // ✅ 함수형 업데이트: prev를 받아서 새 배열 반환
    // 새 항목을 앞에 추가 (최신순)
    setTodos((prev) => [newTodo, ...prev]);
  }

  function toggleTodo(id: string): void {
    setTodos((prev) =>
      prev.map((todo) =>
        // id가 일치하는 항목만 completed를 반전
        // ❓ {...todo, completed: !todo.completed}
        //   → 스프레드로 나머지 속성은 그대로 복사 + completed만 변경
        //   → 원본 객체를 수정하지 않음 (불변성 유지)
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string): void {
    // filter (Array.filter): 조건을 만족하는 항목만 남긴 새 배열
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function editTodo(id: string, text: string): void {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    );
  }

  function clearCompleted(): void {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  // ── 파생 데이터 (계산값) ───────────────────────────────────
  //
  // ❓ 왜 상태로 저장하지 않고 매번 계산하는가?
  //   → filteredTodos는 todos와 filter에서 파생됨
  //   → 상태로 저장하면 동기화 문제 발생 가능 (원본과 불일치)
  //   → 렌더 시마다 계산해도 배열 필터링은 충분히 빠름
  //   → 09번 useMemo에서 "언제 캐싱이 필요한가" 배움
  const filteredTodos: Todo[] = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // 'all'
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // ── 렌더 ───────────────────────────────────────────────────
  //
  // 실무 UI 구조: 로딩 → 에러 → 빈 상태 → 데이터
  // 이 버전은 로딩/에러 없음 (모든 데이터가 클라이언트 메모리) //브라우저 탭 안에 임시로 저장되는 공간
  //  탭 닫으면 사라짐. 서버/DB 없음.
  // 07번(localStorage), 83번(TanStack Query)에서 로딩/에러 추가

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        ← 목록으로
      </Link>

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
            01
          </span>
          <h1 className="text-2xl font-bold text-gray-900">useState 기본</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          핵심: 불변성, 함수형 업데이트, 파생 상태
        </p>
      </div>

      {/* 입력 */}
      <TodoInput onAdd={addTodo} />

      {/* 전체 완료 토글 */}
      {todos.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            // 모든 항목이 완료됐을 때만 체크
            checked={activeCount === 0}
            onChange={() => {
              // 하나라도 미완료면 전체 완료, 전체 완료면 전체 미완료
              const shouldComplete = activeCount > 0;
              setTodos((prev) =>
                prev.map((todo) => ({ ...todo, completed: shouldComplete })),
              );
            }}
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

      {/* 리스트 */}
      <div className="mt-4">
        {filteredTodos.length === 0 ? (
          // ── 빈 상태 분기 ─────────────────────────────────
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
          // ── 데이터 렌더 ──────────────────────────────────
          // ul > li 구조: 시맨틱 HTML + 스크린 리더가 목록으로 인식
          <ul className="flex flex-col gap-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id} // key: React가 항목을 식별하는 기준
                // ❓ key가 없으면?
                //   → 배열 index를 기본으로 사용 → 순서 변경 시 버그
                //   → id처럼 안정적인 고유값을 항상 사용할 것
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>

      {/* 푸터 (항목이 있을 때만) */}
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
