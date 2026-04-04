// ── 동네 그리드 계산 ────────────────────────────────────────────────────────────
// 1셀 = 약 0.005° ≈ 500m 사각형

export const GRID_SIZE = 0.005;

export interface GridCell {
  row: number;
  col: number;
}

export function latLngToCell(lat: number, lng: number): GridCell {
  return {
    row: Math.floor(lat / GRID_SIZE),
    col: Math.floor(lng / GRID_SIZE),
  };
}

export function cellToBounds(cell: GridCell) {
  return {
    sw: { lat: cell.row * GRID_SIZE, lng: cell.col * GRID_SIZE },
    ne: { lat: (cell.row + 1) * GRID_SIZE, lng: (cell.col + 1) * GRID_SIZE },
  };
}

export function cellKey(cell: GridCell): string {
  return `${cell.row}_${cell.col}`;
}

/** 주변 NxN 셀 반환 (기본 radius=2 → 5x5 그리드) */
export function getSurroundingCells(center: GridCell, radius = 2): GridCell[] {
  const cells: GridCell[] = [];
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      cells.push({ row: center.row + dr, col: center.col + dc });
    }
  }
  return cells;
}

/** 문자열 → 간단한 결정론적 해시 (0 이상 정수) */
export function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** 동네 이름 목록으로 셀→동네 소유권 계산 */
export function assignCellOwner(
  cell: GridCell,
  neighborhoods: string[],
  userCell: GridCell,
  userNeighborhood: string,
): string {
  // 유저 본인 셀은 항상 본인 동네
  if (cell.row === userCell.row && cell.col === userCell.col) {
    return userNeighborhood;
  }
  if (neighborhoods.length === 0) return userNeighborhood;
  const hash = simpleHash(cellKey(cell));
  return neighborhoods[hash % neighborhoods.length];
}

/** 동네 이름 → 고유 색상 (HSL) */
export function neighborhoodColor(name: string, alpha = 0.25): string {
  const hue = simpleHash(name) % 360;
  return `hsla(${hue}, 70%, 55%, ${alpha})`;
}

export function neighborhoodStroke(name: string): string {
  const hue = simpleHash(name) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}
