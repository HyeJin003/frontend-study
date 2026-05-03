# 📚 Todo 100번 정답지 — 학습 가이드

> **핵심 마인드셋**
> "일단 돌아가면 됐지" → 취직 안 됨
> "왜 이렇게 짰는지 면접에서 설명할 수 있다" → 합격

---

## 정답지 사용 3단계

### Step 1 — 파일 읽는 순서

각 번호 폴더 `src/app/XX/` 에서 **반드시 이 순서대로** 읽는다.

```
1. types.ts       → 타입/인터페이스 구조 먼저 파악
2. hooks.ts       → (06번~) 커스텀 훅 구현 이해
3. reducer.ts     → (02번~) 상태 변경 로직 이해
4. context.tsx    → (03번~) Provider/훅 구조 이해
5. page.tsx       → 최종적으로 컴포넌트 연결 방식 확인
6. components/    → 각 자식 컴포넌트가 뭘 받는지 확인
```

왜 이 순서인가:
- `types.ts`를 먼저 읽어야 나머지 파일의 타입이 눈에 들어옴
- `page.tsx`를 먼저 읽으면 context/reducer의 이유를 모른 채 결과만 봄
- 컴포넌트는 마지막 — "무엇을 props로 받는지"가 이미 설계 완료된 이후에 확인

---

### Step 2 — 주석의 "왜?"를 생각하며 읽기

코드를 읽기 전, 먼저 자신에게 물어본다:

> "이 코드 없이 어떻게 짰을까? 그리고 왜 이렇게 바꿨을까?"

#### 주석 표시 읽는 법

| 표시 | 의미 | 어떻게 읽나 |
|------|------|------------|
| `// ← 04번:` | 이전 버전과 달라진 지점 | "왜 04번에서 이걸 바꿨나?" |
| `// ── 이 파일을 설계할 때 한 고민` | 설계 과정 5가지 | 각 번호 앞에서 "나라면 어떻게 했을까?" 먼저 생각 |
| `// ── 면접 포인트` | 실제 면접 답변 | 소리 내어 읽고 암기하지 말고 이해할 것 |
| `// 왜 ~인가?` | 이 선택의 이유 | 납득될 때까지 멈출 것. 넘어가지 말 것 |
| `// ❌` / `// ✅` | 안 되는 것 / 되는 것 | 둘의 차이가 무엇인지 말로 설명해볼 것 |

#### 올바른 읽기 방법

```
❌ 코드를 눈으로 쭉 훑고 "이해했다" 하고 넘어가기
❌ 주석을 읽지 않고 코드 구조만 파악하기
❌ 이해 안 되는 부분에서 그냥 넘어가기

✅ 주석의 "왜?"를 읽고 납득이 되면 다음 줄
✅ 이해 안 되는 주석 앞에서 멈추고 문서 찾기
✅ 각 파일 읽은 후 핵심 1~2문장으로 요약해보기
```

이해 안 되는 주석 앞에서 **멈추는 것**이 학습이다.
넘어가는 것은 그냥 눈 운동이다.

---

### Step 3 — 이해 안 되면 문서에서 찾기

#### React 공식 문서

> 주소: **https://react.dev/reference/react**

훅별 직접 링크 (주소창에 바로 입력):

| 훅 | 주소 |
|----|------|
| useState | react.dev/reference/react/useState |
| useEffect | react.dev/reference/react/useEffect |
| useRef | react.dev/reference/react/useRef |
| useReducer | react.dev/reference/react/useReducer |
| useContext | react.dev/reference/react/useContext |
| useCallback | react.dev/reference/react/useCallback |
| useMemo | react.dev/reference/react/useMemo |
| memo | react.dev/reference/react/memo |

**페이지 읽는 순서:**
1. **맨 위 한 줄 요약** — 이 훅이 뭔지 한 줄로 파악
2. **"Usage" 섹션** — 실제 사용 예시 (가장 먼저)
3. **"Reference" 섹션** — 파라미터/반환값 상세
4. **"Deep Dive" 박스 (파란색)** — 내부 동작 원리 (이걸 이해하면 면접 A+)
5. **"Troubleshooting" 섹션** — 흔한 실수와 해결법 (면접 단골 소재)

#### MDN (Web API)

> 주소: **https://developer.mozilla.org**

언제 MDN을 쓰나:

| 코드에서 본 것 | MDN 검색어 |
|--------------|-----------|
| `localStorage.getItem()` | MDN localStorage |
| `setTimeout`, `clearTimeout` | MDN setTimeout |
| `document.title` | MDN Document title |
| `crypto.randomUUID()` | MDN crypto randomUUID |
| `JSON.parse`, `JSON.stringify` | MDN JSON parse |

**찾는 법 (가장 빠른 방법):**
```
Google에서 → "MDN localStorage" 처럼 "MDN + 찾는것" 검색
```

**페이지에서 볼 곳:**
1. **"Syntax"** — 정확한 사용법과 파라미터
2. **"Examples"** — 실제 코드
3. **"Browser compatibility"** — 지원 브라우저 (실무 중요)

---

## 챕터별 정답지 구성

---

### 📗 챕터 1 — 기초 상태 관리 (01~02번)

**학습 목표:** useState와 useReducer의 차이를 말로 설명할 수 있다

**이 챕터에서 증명해야 할 것:**
- "상태를 왜 배열로 관리하나? 객체로 하면 안 되나?"
- "왜 `setTodos([...todos, newTodo])` 대신 `prev => [newTodo, ...prev]` 를 쓰나?"
- "useReducer를 쓰면 뭐가 좋아지나?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 01 | types.ts + page.tsx + components/ | useState로 CRUD + 필터 + 편집 |
| 02 | types.ts + reducer.ts + page.tsx + components/ | 상태 로직을 reducer로 분리 |

**읽을 때 집중할 주석:**
- `01 → 02` 사이의 `// ←` 표시 — 무엇이 왜 바뀌었나
- `reducer.ts`의 각 `case` — "왜 새 배열을 만드나? 기존 배열에 push하면 안 되나?"
- `dispatch({ type: 'ADD' })` — "왜 직접 setTodos 안 하나?"

**React 문서:** react.dev/reference/react/useReducer → "Deep Dive: Writing reducers well"

---

### 📗 챕터 2 — Context 패턴 (03~05번)

**학습 목표:** prop drilling 없이 상태를 공유하는 이유와 방법을 설명할 수 있다

**이 챕터에서 증명해야 할 것:**
- "prop drilling이 뭔가? 왜 문제인가?"
- "왜 StateContext와 DispatchContext를 둘로 나누나?"
- "useEffect deps 배열을 어떻게 결정하나?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 03 | types.ts + context.tsx + page.tsx + components/ | Context + useState |
| 04 | types.ts + reducer.ts + context.tsx + page.tsx + components/ | State/Dispatch Context 분리 |
| 05 | types.ts + reducer.ts + context.tsx + page.tsx + components/ | useEffect 심화 |

**읽을 때 집중할 주석:**
- 03 context.tsx: "왜 `createContext(null)` 인가?"
- 04 context.tsx: "왜 Context를 두 개로 나누나?" — State만 바꿔도 dispatch 구독 컴포넌트가 리렌더되지 않음
- 05 context.tsx: useEffect 4개의 deps — "각 배열이 왜 저렇게 설정됐나?"
- 05 context.tsx 디바운스: "왜 `return () => clearTimeout()`이 필요한가?"

**React 문서:** react.dev/reference/react/useContext → react.dev/reference/react/useEffect

---

### 📗 챕터 3 — useRef 기반 커스텀 훅 (06~07번)

**학습 목표:** useRef와 useEffect로 재사용 가능한 커스텀 훅을 만들 수 있다

**이 챕터에서 증명해야 할 것:**
- "usePrevious 훅을 직접 구현해보세요" (면접 단골)
- "useRef와 useState의 차이가 뭔가?"
- "useLocalStorage를 왜 만드나? localStorage.getItem 직접 쓰면 안 되나?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 06 | types.ts + **hooks.ts** + page.tsx | usePrevious / useDebounce / useLatestRef |
| 07 | types.ts + **hooks.ts** + page.tsx | useLocalStorage / useDocumentTitle |

**읽을 때 집중할 주석:**
- `hooks.ts`를 page.tsx보다 **먼저** 읽는다
- `usePrevious`: "왜 useEffect 안에서 `ref.current = value` 하나?" → 렌더 후 실행되기 때문
- `useDebounce`: "왜 `timerRef`가 필요한가? `useState`로 timer ID 관리하면 안 되나?"
  → setTimerId 호출 자체가 리렌더 유발
- `useLocalStorage`: "왜 `lazy initializer`를 쓰나? `useEffect`로 로드하면 안 되나?"
  → useEffect는 첫 렌더 후 실행 → 빈 상태 flash 발생

**React 문서:** react.dev/reference/react/useRef
**MDN 문서:** MDN localStorage, MDN Document title

---

### 📗 챕터 4 — 메모이제이션 (08~10번)

**학습 목표:** useCallback, useMemo, React.memo의 차이와 조합을 면접에서 설명할 수 있다

**이 챕터에서 증명해야 할 것:**
- "useCallback을 언제 써야 하나? 항상 쓰면 좋은가?"
- "React.memo만 있으면 리렌더를 방지할 수 있나?"
- "useMemo와 useCallback의 차이가 뭔가?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 08 | types.ts + reducer.ts + context.tsx + page.tsx + components/ | useCallback — 함수 참조 안정화 |
| 09 | types.ts + reducer.ts + context.tsx + page.tsx + components/ | useMemo — 값 참조 안정화 |
| 10 | types.ts + reducer.ts + context.tsx + page.tsx + components/ | React.memo — 컴포넌트 최적화 |

**읽을 때 집중할 주석:**
- 08 context.tsx: `setFilterCallback = useCallback(...)` — "왜 dispatch는 그냥 두고 setFilter만 감싸나?"
  → dispatch는 useReducer가 이미 stable 보장
- 09 context.tsx: `activeCount = useMemo(..., [state.todos])` — "왜 deps에 filter가 없나?"
  → activeCount는 filter 관계없이 전체 todos 기준
- 09 context.tsx: `stateValue = useMemo(...)` — "context value 자체를 왜 useMemo로 감싸나?"
  → 매 렌더마다 새 객체 생성 → 모든 구독 컴포넌트 리렌더
- 10 components/TodoItem.tsx: 렌더 카운터 `×N` — 타이핑 중 다른 항목의 숫자가 안 올라야 memo 작동 중
- 10 page.tsx: `handleCommitEdit = useCallback((id, text) => ...)` — "왜 editText를 deps에 안 넣나?"
  → text를 파라미터로 받아 deps 최소화

**React 문서:**
- react.dev/reference/react/useCallback
- react.dev/reference/react/useMemo
- react.dev/reference/react/memo → "Deep Dive: Should you add memo everywhere?"

---

## 컴포넌트 설계 기준

> 컴포넌트에 뭘 넣을지 모를 때 이 순서로 생각할 것

1. 이 컴포넌트가 **화면에 그리는 게** 뭔가? → 그것만 보여주면 됨
2. 그걸 그리는 데 **필요한 데이터**가 뭔가? → 그것만 props/context로 받으면 됨
3. 이 컴포넌트에서 **일어나는 동작**이 뭔가? → 그 동작의 함수만 받으면 됨
4. **필요 없는 건 절대 받지 않는다** → 안 쓰는 props는 넣지 말 것

```
TodoItem   → todo 객체 + onToggle + onDelete + onEdit
TodoEmpty  → filter  (todos 배열 전체 불필요 — 메시지만 보여주면 됨)
TodoFooter → activeCount + completedCount + filter + onFilterChange + onClearCompleted
```

---

## 코드 작성 규칙

- TypeScript `any` 절대 금지 — 정확한 타입을 정의할 것
- 모든 "왜"를 주석으로 설명 — **무엇(what)** 이 아닌 **이유(why)** 를 주석에 적을 것
- 새 번호는 이전 버전의 리팩토링 형태 (01 → 02 → 03 순서로 개선)
- 컴포넌트 함수 이름 = 역할을 정확히 표현하는 이름

**좋은 주석 vs 나쁜 주석:**
```ts
// ❌ 나쁜 주석: 코드가 무엇을 하는지 설명
// todos 배열에서 완료된 항목 제거
todos.filter(t => !t.completed)

// ✅ 좋은 주석: 왜 이렇게 하는지 설명
// 원본 배열을 변경하지 않고 새 배열 반환 — React 불변성 원칙
todos.filter(t => !t.completed)
```

---

## 다음 번호로 넘어가는 기준

```
✅ 이 코드가 왜 이렇게 동작하는지 말로 설명할 수 있다
✅ 비슷한 상황에서 이 패턴을 떠올릴 수 있다
✅ 면접 포인트 Q에 A를 보지 않고 대답할 수 있다
→ 다음 번호로 이동

❌ 코드가 어떻게 동작하는지는 알지만 왜 이렇게 짰는지 모른다
→ context.tsx / reducer.ts 설계 고민 주석 다시 읽기
```
