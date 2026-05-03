// ─────────────────────────────────────────────────────────────
// 📗 챕터 3 — useRef/useEffect 커스텀 훅 (06~07번)
// 공통 규칙(파일 읽는 순서/주석 읽는 법/컴포넌트 설계) → 01번 page.tsx 상단 참고
// ─────────────────────────────────────────────────────────────
//
// 이 챕터 읽는 순서:
//   06번: types.ts → hooks.ts → page.tsx   ← hooks.ts 반드시 먼저!
//   07번: types.ts → hooks.ts → page.tsx   ← hooks.ts 반드시 먼저!
//
// 이 챕터 React/MDN 문서:
//   react.dev/reference/react/useRef → "Deep Dive: Avoid recreating the ref contents"
//   react.dev/reference/react/useEffect
//   MDN localStorage (Google에서 "MDN localStorage" 검색)
//   MDN setTimeout  (Google에서 "MDN setTimeout" 검색)
//
// 이 챕터에서 생각해볼 것:
//   - "usePrevious 훅을 직접 구현해보세요" (면접 단골)
//     → useRef와 useEffect를 어떻게 조합하나?
//   - "왜 timerRef를 useState가 아닌 useRef로 관리하나?"
//     → setTimerId 호출 시 리렌더 발생 vs ref는 리렌더 없음
//   - "useLocalStorage: lazy initializer vs useEffect 첫 로드의 차이?"
//     → useEffect는 첫 렌더 후 실행 → 빈 상태로 한 번 렌더되는 flash 발생
//   - "useLatestRef는 어떤 문제를 해결하나?" (stale closure)
//
// ═══════════════════════════════════════════════════════════════
// 06번: useRef 기반 커스텀 훅 — 실무에서 가장 자주 쓰이는 3가지
// ═══════════════════════════════════════════════════════════════
//
// ── 왜 hooks.ts로 분리하나? ──────────────────────────────────
//   이 훅들은 Todo 앱에 종속되지 않음 — 어느 프로젝트에서나 복붙 없이 import.
//   실제로 react-use, ahooks, usehooks-ts 같은 라이브러리에 동일 구현이 있음.
//   "직접 만들어보세요" 가 면접 단골 문제.
//
// ── 이 파일을 설계할 때 한 고민 ────────────────────────────────
//
//   1. 화면에 뭘 보여줘야 하나?     → 없음 — 훅은 UI를 직접 렌더하지 않음
//   2. 어떤 상태가 바뀌나?          → ref.current (리렌더 없음), debouncedValue (useState)
//   3. 그 상태를 바꾸는 함수는?     → 훅 내부에서만 처리, 외부엔 반환값만 노출
//   4. 타입을 어떻게 정의했나?      → 제네릭 <T>로 모든 타입에 재사용 가능하게
//   5. 반환값을 어떻게 설계했나?    → usePrevious: T | undefined
//                                      useDebounce: T (debouncedValue)
//                                      useLatestRef: MutableRefObject<T>
//
//   ── 면접 포인트 ──────────────────────────────────────────────
//   Q: "usePrevious 훅을 직접 구현해보세요."
//   A: "useRef와 useEffect를 조합합니다.
//       useEffect는 렌더 이후에 실행되므로,
//       return ref.current 시점에는 이전 렌더의 값이 담겨 있습니다.
//       effect가 실행된 후에야 ref.current가 최신 값으로 갱신됩니다."
//
// ── 훅 3가지 요약 ────────────────────────────────────────────
//
//   usePrevious<T>    — 이전 렌더의 값 반환 (면접 단골)
//   useDebounce<T>    — 값 변경 후 delay ms 뒤 반영 (타이머 ID를 ref로 관리)
//   useLatestRef<T>   — 항상 최신 값을 ref로 유지 (stale closure 방지)
//
// ═══════════════════════════════════════════════════════════════

import { useRef, useEffect, useState } from 'react'

// ── 1. usePrevious ────────────────────────────────────────────
//
// 핵심 원리:
//   useEffect는 렌더 완료 후 실행 → return ref.current 시점엔 아직 이전 값
//   렌더가 끝난 뒤 effect가 실행되면서 ref.current가 최신 값으로 갱신
//
// 면접 구현 포인트:
//   const ref = useRef<T | undefined>(undefined)  ← 초기값 undefined (첫 렌더 이전 값 없음)
//   useEffect(() => { ref.current = value })       ← deps 없음 = 매 렌더 후 실행
//   return ref.current                             ← 이번 렌더 기준으로 "이전 값"
//
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  })
  // ← React 19 lint(react-hooks/refs): "렌더 중 ref.current 접근 금지" 규칙에 걸림
  //   그러나 usePrevious는 이 동작에 의도적으로 의존:
  //   useEffect는 렌더 완료 후 실행 → return 시점엔 ref.current = 이전 값
  //   이처럼 lint 규칙의 "왜"를 이해하고 의도적으로 비활성화하는 것도 실무 능력.
  // eslint-disable-next-line react-hooks/refs
  return ref.current
}

// ── 2. useDebounce ───────────────────────────────────────────
//
// 핵심 원리:
//   value가 바뀔 때마다 이전 타이머를 취소하고 새 타이머를 설정.
//   delay ms 동안 value가 바뀌지 않으면 debouncedValue 업데이트.
//
// 왜 timerRef가 필요한가?
//   timerRef.current = setTimeout(...)
//   → 타이머 ID를 useState로 관리하면 setTimerId 호출 자체가 리렌더를 발생시킴
//   → useRef는 값 변경 시 리렌더 없음 → 클린업만 하면 됨
//
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, delay])

  return debouncedValue
}

// ── 3. useLatestRef ──────────────────────────────────────────
//
// 핵심 원리:
//   setTimeout / setInterval 내부 콜백은 생성 시점의 값을 "캡처" (stale closure).
//   ref.current는 리렌더마다 최신 값으로 갱신되므로 항상 최신 값을 읽을 수 있음.
//
// 사용 예:
//   const onKeyDownRef = useLatestRef(onKeyDown)
//   setTimeout(() => onKeyDownRef.current('Enter'), 1000)
//   → 1초 후에도 최신 onKeyDown 핸들러를 호출
//
export function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}
