// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: ErrorMessage
//
// 에러 상태를 항상 처리해야 하는 이유:
//   - 실무에서 에러 없는 앱은 없다
//   - 에러를 무시하면 사용자는 흰 화면만 본다
//   - 에러 메시지 + 재시도 버튼이 최소 요건
// ─────────────────────────────────────────────────────────────

interface ErrorMessageProps {
  message: string
  onRetry?: () => void // 재시도 버튼 (선택)
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    // role="alert" → 스크린 리더가 즉시 읽어줌
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center"
    >
      {/* 에러 아이콘 */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true" // 장식용 아이콘은 스크린 리더에서 숨김
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
