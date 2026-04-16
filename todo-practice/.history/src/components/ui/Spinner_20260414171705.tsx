// ─────────────────────────────────────────────────────────────
// 공통 컴포넌트: Spinner (로딩 인디케이터)
//
// 왜 공통 컴포넌트로 분리하는가?
//   → 여러 곳에서 쓰이는 UI를 한 곳에서 관리
//   → 디자인 변경 시 한 파일만 수정하면 전체 반영
//   → 일관된 UX 보장
// ─────────────────────────────────────────────────────────────

// size 타입을 string으로 열어두지 않고 리터럴 유니온으로 제한
// → 잘못된 값('xxl' 같은) 을 컴파일 타임에 차단
type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string; //접근성: 스크린 리더가 읽을 텍스트
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};
export default function Spinner({
  size = "md",
  label = "로딩중....",
}: SpinnerProps) {
  return (
    <>
      <div
        role="status"
        aria-label={label}
        className="flex items-center justify-center"
      >
        <div className="" />
        <span></span>
      </div>
    </>
  );
}
