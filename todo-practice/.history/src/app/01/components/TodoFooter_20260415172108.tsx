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
, onClearCompleted, }) {
  return <div></div>;
}
