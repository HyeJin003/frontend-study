// ── 이 파일을 설계할 때 한 고민 ──────────────────────────────
// Q: LoginFormData를 왜 interface로 정의하나?
//
// interface vs type alias:
//   - interface → 확장(extends) 가능, 객체 형태 명시적
//   - type alias → 유니온/인터섹션 등 복잡한 타입에 유리
//   → 단순 객체 형태는 interface 선호 (공식 React/TS 문서 권장)
// ─────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string
  password: string
}

// 왜 error를 LoginFormData에 포함하지 않나?
// → error는 "폼의 데이터"가 아닌 "UI 상태"
//    데이터와 UI 상태를 분리해야 컴포넌트가 명확해진다
