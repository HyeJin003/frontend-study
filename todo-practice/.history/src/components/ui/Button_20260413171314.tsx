// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: Button
//
// 실무에서 Button을 공통화하는 이유:
//   1. variant(primary/danger/ghost)를 한 곳에서 관리
//   2. disabled 상태, 로딩 상태를 일관되게 처리
//   3. 접근성 속성(aria-*)을 강제할 수 있음
// ─────────────────────────────────────────────────────────────

// React의 기본 button 속성을 모두 상속받으면서 확장
// ComponentPropsWithoutRef → ref 제외한 모든 button 속성
// (ref가 필요하면 forwardRef 패턴 사용 — 13번 예제에서 배움)
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// HTML button의 모든 속성(onClick, type, disabled 등)을 자동으로 받음
// & 로 우리 커스텀 속성 추가
type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 disabled:text-gray-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest // 나머지 button 속성(onClick, type 등)을 그대로 전달
}: ButtonProps) {
  return (
    <button
      // isLoading 중이거나 disabled면 버튼 비활성화
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {isLoading && (
        // 버튼 내부 스피너: 사이즈 sm 고정
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
