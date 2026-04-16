// ─────────────────────────────────────────────────────────────
// TodoEmpty: 할일이 없을 때 보여주는 빈 상태 UI
//
// 왜 빈 상태 UI가 필요한가?
//   → 흰 화면만 보이면 앱이 고장난 건지 비어있는 건지 모름
//   → "아무것도 없어요" 피드백이 UX의 기본
//   → Server Component (useState 없음 → 'use client' 불필요)
// ─────────────────────────────────────────────────────────────

interface TodoEmptyProps {
  // filter에 따라 메시지를 다르게 표시

  message?: string;
}
export default function TodoEmpty({
  message = "할일이 없어요. 새로운 할일을 추가해보세요!",
}: TodoEmptyProps) {
  return (
    <div className="">
      {/* 빈 박스 아이콘 */}
      {message}
    </div>
  );
}
