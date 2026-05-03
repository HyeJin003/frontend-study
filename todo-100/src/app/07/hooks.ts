// ═══════════════════════════════════════════════════════════════
// 07번: useEffect 기반 커스텀 훅 — 외부 시스템 동기화
// ═══════════════════════════════════════════════════════════════
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → 없음 — 훅은 UI를 직접 렌더하지 않음
//   2. 어떤 외부 시스템과 동기화하나? → localStorage (데이터 영속), document.title (탭 제목)
//   3. API를 어떻게 설계했나?       → useState와 동일한 [value, setValue] 튜플 반환
//                                      → 기존 useState를 useLocalStorage로 한 줄만 교체
//   4. 타입을 어떻게 정의했나?      → 제네릭 <T>로 어떤 타입이든 저장 가능
//   5. 반환값을 어떻게 설계했나?    → useLocalStorage: [T, (value) => void]
//                                      useDocumentTitle: void (사이드이펙트만)
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useLocalStorage에서 왜 lazy initializer를 쓰나요?"
//   A: "useEffect는 첫 렌더 후 실행됩니다.
//       lazy initializer를 쓰면 렌더 전에 localStorage 값을 읽어
//       빈 상태로 한 번 렌더되는 플래시(flash)를 방지합니다.
//       SSR 환경에서는 window가 없으므로 typeof window 분기가 필요합니다."
//
// ── 핵심 개념: useEffect는 "외부 시스템과의 동기화" 도구 ────────
//
//   React 공식 문서의 정의:
//   "Effects let you run some code after rendering so that you can
//    synchronize your component with some system outside of React."
//
//   07번의 두 외부 시스템:
//   ① localStorage  — 브라우저 저장소
//   ② document.title — 브라우저 탭 제목
//
// ── 06번과 비교 ──────────────────────────────────────────────
//   06번 hooks.ts: useRef로 값/DOM 관리 (렌더 사이클 내부)
//   07번 hooks.ts: useEffect로 외부 시스템 동기화 (렌더 사이클 외부)
//
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'

// ── 1. useLocalStorage ───────────────────────────────────────
//
// useState의 drop-in replacement — 자동으로 localStorage에 영속
// react-use / usehooks-ts 에 동일 구현이 존재하는 실무 패턴
//
// ── 내부 useEffect 패턴 2가지 ────────────────────────────────
//
//   ① useState lazy initializer (마운트 1회)
//      → [] deps useEffect와 동일한 효과, 렌더 전에 실행
//      → SSR 환경(window 없음)을 typeof window로 분기 처리
//
//   ② useEffect([key, value])
//      → value 바뀔 때마다 localStorage에 저장
//      → 06번 useDebounce의 timerRef 클린업 패턴과 달리 클린업 불필요
//        (저장은 누적돼도 괜찮고, 마지막 값만 남으면 됨)
//
// ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "localStorage 초기 로드를 useEffect 대신 lazy initializer로 하는 이유?"
//   A: "useEffect는 첫 렌더 후 실행됩니다.
//       lazy initializer를 쓰면 렌더 전에 초기값을 세팅해
//       빈 상태로 한 번 렌더되는 플래시(flash)를 방지합니다."
//
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR 환경(window 없음)에서는 defaultValue 반환
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  // storedValue가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // localStorage 용량 초과 등 무시
    }
  }, [key, storedValue])

  // useState와 동일한 API (함수형 업데이트 지원)
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev =>
      typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
    )
  }, [])

  return [storedValue, setValue]
}

// ── 2. useDocumentTitle ──────────────────────────────────────
//
// document.title 동기화 + 페이지 이탈 시 이전 제목으로 복원
//
// ── 클린업 함수의 역할 ────────────────────────────────────────
//   return () => { document.title = prevTitle }
//   → 컴포넌트 언마운트 시 실행
//   → 다른 페이지로 이동해도 탭 제목이 남아있는 문제 방지
//
// ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "useEffect의 클린업 함수는 언제 실행되나요?"
//   A: "① deps가 바뀌어 effect가 재실행되기 직전
//       ② 컴포넌트가 언마운트될 때
//       두 경우 모두 이전 effect의 클린업이 먼저 실행됩니다."
//
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title
    return () => {
      document.title = prevTitle // 언마운트 시 복원
    }
  }, [title])
}
