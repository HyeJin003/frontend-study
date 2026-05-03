// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: Button
//
// 실무에서 Button을 공통화하는 이유:
//   1. variant(primary/danger/ghost)를 한 곳에서 관리
//   2. disabled 상태, 로딩 상태를 일관되게 처리
//   3. 접근성 속성(aria-*)을 강제할 수 있음
// ─────────────────────────────────────────────────────────────

import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'primary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  danger:  'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  ghost:   'bg-transparent text-gray-600 hover:bg-gray-100 disabled:text-gray-300',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
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
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
