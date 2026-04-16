// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: Input
//
// input을 공통화하면:
//   - 에러 상태 스타일을 한 곳에서 관리
//   - label과 input을 항상 연결(접근성) → htmlFor + id
//   - forwardRef로 부모에서 focus() 호출 가능 (06번 예제)
// ────────────────────────────────────────────────────

import { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  errorMessage?: string;
};
const Input = forwardRef<HTMLInputElement, InputProps>(function input(
  { label, errorMessage, id, className = "", ...rest },
  ref,
) {
  // id가 없으면 label-input 연결 불가 → 접근성 깨짐
  // 실무에서는 useId() 훅으로 자동 생성 (14번 예제)
  // 이걸 쓰는이유가 웹상에선 문제 없을 순 있으나 , 모바일은 input 이 작아  사용자의 편리성과 ,접근성으로 사용
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm 
        transition-colors duration-150 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          disabled:cursor-not-allowed disabled:bg-gray-100
          ${errorMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
          ${className}`}
        aria-invalid={errorMessage !== undefined}
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        {...rest}
      />
    </div>
  );
});
