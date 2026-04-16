// ─────────────────────────────────────────────────────────────
// TodoFooter: 카운터 + 필터 탭 + 완료 일괄 삭제
// ─────────────────────────────────────────────────────────────

import { FilterType } from "@/app/01/types";

interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function TodoFooter({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}: TodoFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4">
      {/* 남은 항목 수 */}
      <span className="text-sm text-gray-500">
        {/* 복수형 처리: 한국어는 단/복수 구분 없지만 영어 대비 습관 */}
        <strong className="font-semibold text-gray-800">{activeCount}</strong>
      </span>
      {/* 필터 탭 */}
      <div className="flex gap-1" role="group" aria-label="할일 필터">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            // aria-pressed: 현재 선택된 필터 표시
            aria-pressed={filter === value}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${
                filter === value
                  ? "bg-blue-500 text-white" // 선택됨
                  : "text-gray-600 hover:bg-gray-100" // 미선택
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* 완료 일괄 삭제 — 완료 항목이 있을 때만 표시 */}
    </div>
  );
}
