// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//   1. 화면에 뭘 보여줘야 하나?     → React 바깥에서 관리되는 todos 배열
//   2. 어떤 상태가 바뀌나?          → todos 배열 (외부 스토어)
//   3. 그 상태를 바꾸는 함수는?     → addTodo, toggleTodo, deleteTodo
//   4. 타입을 어떻게 정의했나?      → listeners: Set<() => void> 로 구독 관리
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → subscribe, getSnapshot, getServerSnapshot
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "getServerSnapshot이 필요한 이유는?"
//   A: "SSR에서 localStorage 등 브라우저 API에 접근할 수 없습니다.
//       getServerSnapshot은 서버에서 안전하게 반환할 초기값(보통 빈 배열)을
//       제공해서 hydration 오류를 방지합니다."
// ─────────────────────────────────────────────────────────────

// 'use client' 없이도 import 가능 — React 바깥의 순수 스토어
// useSyncExternalStore: React 바깥 상태를 React와 동기화.
// Zustand/Redux 내부에서 쓰는 패턴과 동일한 원리

import type { Todo } from './types'

const STORAGE_KEY = 'todo-15'

function loadFromStorage(): Todo[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

function saveToStorage(todos: Todo[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

// ── 외부 스토어 구현 ────────────────────────────────────────
// listeners: 구독자 Set — notify 호출 시 모든 구독자에게 변경 알림
// getSnapshot: 현재 상태의 스냅샷 반환 (동기, 순수함수여야 함)
// getServerSnapshot: SSR 시 서버에서 반환할 값 (보통 빈 배열)
// subscribe: 구독 등록 + 구독 취소 함수 반환 (useSyncExternalStore 규약)

let todos: Todo[] = loadFromStorage()
const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach(listener => listener())
}

export const todoStore = {
  // useSyncExternalStore에 전달하는 세 가지 함수
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener) // cleanup 함수 반환
  },

  // 현재 상태 스냅샷 — Concurrent Mode에서 일관성 보장
  getSnapshot(): Todo[] {
    return todos
  },

  // SSR 시 서버에서 반환할 값 — localStorage 없는 환경에서 안전
  getServerSnapshot(): Todo[] {
    return []
  },

  // 뮤테이션 함수들
  addTodo(text: string): void {
    todos = [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...todos,
    ]
    saveToStorage(todos)
    notify()
  },

  toggleTodo(id: string): void {
    todos = todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    saveToStorage(todos)
    notify()
  },

  deleteTodo(id: string): void {
    todos = todos.filter(t => t.id !== id)
    saveToStorage(todos)
    notify()
  },

  clearCompleted(): void {
    todos = todos.filter(t => !t.completed)
    saveToStorage(todos)
    notify()
  },
}
