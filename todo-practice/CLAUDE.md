@AGENTS.md

## 연습 파일 생성 규칙

todo-practice 안에 새 연습 파일(page.tsx, context.tsx, reducer.ts 등)을 만들 때
반드시 파일 상단 주석에 아래 항목을 모두 포함할 것:

## 연습 파일 구현 규칙

- 연습 파일의 함수/컴포넌트 본문은 **절대 구현하지 말 것**
- TODO 주석 + stub(빈 값 반환)만 남겨둘 것
- 사용자가 직접 채워 넣어야 학습이 됨

```
// ❌ 금지: 구현 채워넣기
export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([])
  function addTodo() { ... }  ← 이렇게 하면 안 됨
}

// ✅ 올바른 방법: stub만 남김
export function TodoProvider({ children }) {
  // 여기에 작성
  return <TodoContext.Provider value={stubValue}>{children}</TodoContext.Provider>
}
```

---

```
// ═══════════════════════════════════════════════════════════════
// XX번 연습: <개념 이름>
// 📖 정답: todo-100/src/app/XX/<파일명>
// ═══════════════════════════════════════════════════════════════
//
// 🟡 Step N: <이전 단계> 완성 후 이 파일을 작성하세요
//
// ❓ 생각해보기:
//   - <이 개념의 핵심 질문 1>
//   - <이 개념의 핵심 질문 2>
//   - <이 개념의 핵심 질문 3>
//
// 💡 무엇을 넣어야 할지 고민하는 법:
//   1. 화면에 뭘 보여줘야 하나?     → 상태(state) 목록
//   2. 어떤 상태가 바뀌나?          → 변경 케이스 목록
//   3. 그 상태를 바꾸는 함수는?     → 함수 목록
//   4. 타입을 어떻게 정의하나?      → interface/type 설계
//   5. 자식 컴포넌트들이 뭘 필요로 하나? → props 또는 context value 목록
//   → "자식 컴포넌트들이 필요한 것 목록" = value/props에 넣을 것
//
// 작성 순서:
//   1. <Step 1>
//   2. <Step 2>
//   3. <Step 3>
//   4. <Step 4>
// ═══════════════════════════════════════════════════════════════
```
