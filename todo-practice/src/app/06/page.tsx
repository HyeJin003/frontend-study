'use client'

// ═══════════════════════════════════════════════════════════════
// 06번 연습: useRef — DOM 접근 & 렌더 간 값 유지
// 📖 정답: todo-100/src/app/06/page.tsx
//
// 🟡 Step 2: types.ts 완성 후 이 파일 작성
//
// ── 05번 대비 변화 ────────────────────────────────────────────
//   - Context/Reducer 제거 → 단일 page.tsx에 모두 인라인
//   - useRef 두 가지 용도 추가:
//     ① inputRef   — 마운트 시 자동 포커스 + 할일 추가 후 포커스
//     ② prevCountRef — todos 개수 변화 감지 (리렌더 없이 이전 값 유지)
//     ③ notificationTimerRef — setTimeout id 보관 (알림 겹침 방지)
//
// ── 여러분이 할 것 ────────────────────────────────────────────
//   1. useState로 todos, filter, inputText, editingId, editText, notification 선언
//   2. useRef 세 개 선언 (inputRef, prevCountRef, notificationTimerRef)
//   3. useEffect 두 개 작성:
//      - [] deps: 마운트 후 input 자동 포커스
//      - [todos.length] deps: 개수 변화 감지 → 알림 + prevCountRef 업데이트
//   4. CRUD 함수 구현 (addTodo, toggleTodo, deleteTodo, startEdit, commitEdit 등)
//   5. JSX: 알림 배너 + useRef 설명 박스 + 입력창(ref 연결) + 목록 + 푸터
//
// ── 면접 포인트 ───────────────────────────────────────────────
//   Q: "useRef와 useState의 차이가 뭔가요?"
//   A: useRef는 .current 변경 시 리렌더를 유발하지 않습니다.
//      렌더 사이에 값을 기억하되 UI 변경이 불필요할 때 사용합니다.
//      (이전 카운트, 타이머 id, DOM 참조 등)
//
// 작성 순서:
//   1. types.ts의 Todo, FilterType import
//   2. useState 6개 선언
//   3. useRef 3개 선언
//   4. useEffect 2개 작성
//   5. CRUD 함수 구현
//   6. JSX 작성 (ref={inputRef} 잊지 않기)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import type { Todo, FilterType } from './types'

export default function TodoPage() {
  // TODO [Step 2-A]: useState 선언
  // 힌트: todos, filter, inputText, editingId, editText, notification

  // TODO [Step 2-B]: useRef 선언
  // 힌트:
  //   const inputRef = useRef<HTMLInputElement>(null)
  //   const prevCountRef = useRef<number>(0)
  //   const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // TODO [Step 2-C]: useEffect — 마운트 시 자동 포커스 ([] deps)

  // TODO [Step 2-D]: useEffect — todos 개수 변화 감지 ([todos.length] deps)
  // 힌트: prevCountRef.current와 비교 → diff 계산 → setNotification → 2초 후 null

  // TODO [Step 2-E]: CRUD 함수
  // addTodo: 추가 후 inputRef.current?.focus() 호출 잊지 않기
  // toggleTodo, deleteTodo, startEdit, commitEdit, clearCompleted, toggleAll

  // TODO [Step 2-F]: 파생 데이터 (filteredTodos, activeCount, completedCount)

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← 목록으로
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">06</span>
          <h1 className="text-2xl font-bold text-gray-900">useRef — DOM 접근 & 값 유지 — 연습</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          자동 포커스 · 이전 카운트 추적 · 리렌더 없는 값 저장
        </p>
      </div>

      {/* TODO [Step 2-G]: 알림 배너 (notification이 있을 때만 렌더) */}

      {/* TODO [Step 2-H]: useRef 설명 박스 (orange-50 bg) */}

      {/* TODO [Step 2-I]: 입력창 — ref={inputRef} 연결 */}

      {/* TODO [Step 2-J]: 전체 선택 체크박스 + prevCountRef 표시 */}

      {/* TODO [Step 2-K]: 할 일 목록 */}

      {/* TODO [Step 2-L]: 푸터 (필터 버튼 + activeCount + clearCompleted) */}
    </div>
  )
}
