// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: Input
//
// input을 공통화하면:
//   - 에러 상태 스타일을 한 곳에서 관리
//   - label + input 항상 연결(접근성) → htmlFor + id
// ─────────────────────────────────────────────────────────────

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label?: string
  errorMessage?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, errorMessage, id, className = '', ...rest },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

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
        className={`
          rounded-lg border px-3 py-2 text-sm
          transition-colors duration-150
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          disabled:cursor-not-allowed disabled:bg-gray-100
          ${errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={errorMessage !== undefined}
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        {...rest}
      />
      {errorMessage && (
        <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
})

export default Input
