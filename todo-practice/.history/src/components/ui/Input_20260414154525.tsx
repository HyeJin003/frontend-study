// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: Input
//
// input을 공통화하면:
//   - 에러 상태 스타일을 한 곳에서 관리
//   - label과 input을 항상 연결(접근성) → htmlFor + id
//   - forwardRef로 부모에서 focus() 호출 가능 (06번 예제)
// ────────────────────────────────────────────────────

type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  errorMessage?: string;
};
const Input = forwardRef<HTMLInputElement, InputProps>;
