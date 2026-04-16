// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: ErrorMessage
//
// 에러 상태를 항상 처리해야 하는 이유:
//   - 실무에서 에러 없는 앱은 없다
//   - 에러를 무시하면 사용자는 흰 화면만 본다
//   - 에러 메시지 + 재시도 버튼이 최소 요건
// ─────────────────────────────────────────────────────────────
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage() {
  return (
    // role="alert" → 스크린 리더가 즉시 읽어줌
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center"
    ></div>
  );
}
