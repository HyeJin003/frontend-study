# 📚 Todo 100번 학습 가이드

## 학습 순서 (3단계)

> **핵심**: 취직 후 "왜 이렇게 짰는지" 설명할 수 있어야 한다.
> 코드 암기가 아닌 **개념 체화**가 목표.

### Step A — 정답 코드 읽기 (todo-100/)

- `todo-100/src/app/N/` 폴더 열기
- **주석의 "왜?"를 이해하며** 천천히 읽는다
- 특히 `// ← 01번:` 비교 주석을 눈여겨 본다
- 이해 안 되는 부분은 MDN / React 공식 문서 찾아보기

### Step B — 보고 치기 `/N` (todo-practice/)

```bash
cd todo-practice
npm run dev   # 브라우저 켜두고
```

- `/N` 라우트에서 TODO 힌트를 **보면서** 손으로 직접 타이핑
- 복사 붙여넣기 절대 금지
- **파일 작성 순서를 지킨다** (주석에 🔴→🟡→🟢 표시):
  1. `types.ts` — 타입/액션 정의 먼저
  2. `reducer.ts` (02번~) — 순수 로직
  3. `page.tsx` — 마지막에 연결
- 타이핑할 때마다 브라우저 새로고침 → 기능이 점점 추가되는 걸 확인

### Step C — 안보고 치기 (레벨 단위로)

- **Level 전체(01~20)를 Step B까지 완성한 후** 01b~20b를 한꺼번에 도전
- 각 `/Nb` 라우트의 빈 파일들을 열기
- 정답/힌트 **일절 보지 않고** 처음부터 작성
- 막히는 부분 = "아직 내 것이 아닌 개념"
  → 막힌 부분만 todo-100 확인 → 이해 → 다시 작성
- **Level 1 전체 b 시리즈 막힘 없이 완성 = Level 2로 이동**

---

---

## 다음 버전으로 넘어가는 기준

```
✅ 이 코드가 왜 이렇게 동작하는지 설명할 수 있다
✅ 비슷한 상황에서 이 패턴을 떠올릴 수 있다
→ 다음 번호로 이동
```

## 핵심 마인드셋

```
❌ "일단 돌아가면 됐지" → 취직 안 됨
✅ "왜 이렇게 짰는지 면접에서 설명할 수 있다" → 합격
```

---

## 100가지 목록 & 진행 현황

> 완료하면 `- [ ]` → `- [x]` 로 바꿔서 진행 현황을 추적하세요!

### 🟢 LEVEL 1 — React 내장 훅 (01~20)

- [x] 1.  useState 기본
- [x] 2.  useReducer
- [x] 3.  useContext + useState
- [ ] 4.  useContext + useReducer
- [ ] 5.  커스텀훅 분리 (useTodos)
- [ ] 6.  useRef 활용
- [ ] 7.  useEffect + localStorage
- [ ] 8.  useCallback
- [ ] 9.  useMemo
- [ ] 10. React.memo
- [ ] 11. useLayoutEffect
- [ ] 12. useImperativeHandle
- [ ] 13. forwardRef
- [ ] 14. useId
- [ ] 15. useSyncExternalStore
- [ ] 16. useTransition
- [ ] 17. useDeferredValue
- [ ] 18. Lifting State Up
- [ ] 19. Controlled vs Uncontrolled
- [ ] 20. 상태 정규화

### 🟡 LEVEL 2 — 컴포넌트 설계 패턴 (21~35)

- [ ] 21. Compound Components
- [ ] 22. Render Props
- [ ] 23. Higher-Order Component
- [ ] 24. Custom Hook 라이브러리
- [ ] 25. 컴포넌트 조합 (Slots)
- [ ] 26. 에러 바운더리
- [ ] 27. Suspense + lazy
- [ ] 28. Portal
- [ ] 29. 제어역전 (IoC)
- [ ] 30. Headless UI 패턴
- [ ] 31. Provider 중첩
- [ ] 32. 상태 머신 (직접 구현)
- [ ] 33. Observer 패턴
- [ ] 34. Command 패턴 (Undo/Redo)
- [ ] 35. Factory 패턴

### 🟠 LEVEL 3 — 성능 최적화 (36~50)

- [ ] 36. 가상화 (react-window)
- [ ] 37. 가상화 (react-virtuoso)
- [ ] 38. 디바운스 검색
- [ ] 39. 스로틀링
- [ ] 40. Web Worker
- [ ] 41. requestAnimationFrame
- [ ] 42. Immer
- [ ] 43. 배치 업데이트
- [ ] 44. 선택적 리렌더
- [ ] 45. Profiler API
- [ ] 46. 코드 스플리팅
- [ ] 47. 이미지 최적화
- [ ] 48. 폰트 최적화
- [ ] 49. 번들 분석
- [ ] 50. Core Web Vitals

### 🔵 LEVEL 4 — 상태관리 라이브러리 (51~62)

- [ ] 51. Zustand 기본
- [ ] 52. Zustand + Immer
- [ ] 53. Zustand + persist
- [ ] 54. Jotai 기본
- [ ] 55. Jotai 파생 atom
- [ ] 56. Redux Toolkit
- [ ] 57. RTK Query
- [ ] 58. Valtio
- [ ] 59. Recoil
- [ ] 60. MobX
- [ ] 61. XState
- [ ] 62. Signals

### 🟣 LEVEL 5 — 폼 & 유효성 검사 (63~68)

- [ ] 63. React Hook Form
- [ ] 64. Zod 스키마
- [ ] 65. RHF + Zod
- [ ] 66. useFieldArray
- [ ] 67. 다단계 폼
- [ ] 68. Yup

### 🔴 LEVEL 6 — Next.js 심화 (69~82)

- [ ] 69. Server Components
- [ ] 70. Server Actions
- [ ] 71. Route Handlers
- [ ] 72. Middleware
- [ ] 73. SSR
- [ ] 74. SSG
- [ ] 75. ISR
- [ ] 76. Streaming SSR
- [ ] 77. Parallel Routes
- [ ] 78. Intercepting Routes
- [ ] 79. URL 상태 (searchParams)
- [ ] 80. Metadata API
- [ ] 81. next/headers
- [ ] 82. Edge Runtime

### 🟤 LEVEL 7 — 데이터 & 백엔드 연동 (83~90)

- [ ] 83. TanStack Query
- [ ] 84. Optimistic Updates
- [ ] 85. SWR
- [ ] 86. Supabase
- [ ] 87. Prisma + SQLite
- [ ] 88. Firebase Firestore
- [ ] 89. next-auth
- [ ] 90. WebSocket

### ⭐ LEVEL 8 — UI/UX & 접근성 (91~96)

- [ ] 91. Framer Motion
- [ ] 92. @dnd-kit (드래그 앤 드롭)
- [ ] 93. 다크모드
- [ ] 94. 접근성 (a11y)
- [ ] 95. 스켈레톤 UI
- [ ] 96. Toast 알림

### 🚀 LEVEL 9 — 테스트 & 고급 (97~100)

- [ ] 97. React Testing Library
- [ ] 98. Playwright E2E
- [ ] 99. PWA
- [ ] 100. Claude AI 연동
