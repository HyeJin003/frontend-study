// ═══════════════════════════════════════════════════════════════
// 01번: useState 기본 — 타입 정의
// ═══════════════════════════════════════════════════════════════
//
// 왜 타입을 별도 파일로 분리하는가?
//   - 여러 컴포넌트가 같은 타입을 공유
//   - 타입 변경 시 한 곳만 수정
//   - import 경로를 보면 "이 컴포넌트가 뭘 다루는지" 바로 파악
// ═══════════════════════════════════════════════════════════════

// ❓ interface vs type 언제 쓰는가?
//   - interface: 객체 형태, 확장(extends) 가능 → 도메인 모델에 적합
//   - type: 유니온, 인터섹션, 유틸리티 타입 등 복잡한 타입 표현
//   → 도메인 데이터(Todo)는 interface, 그 외 type 사용
export interface Todo {
  id: string          // crypto.randomUUID() 로 생성 → 절대 중복 없음
  text: string        // 할일 내용
  completed: boolean  // 완료 여부
  createdAt: number   // Date.now() — 정렬 기준
}

// 필터 타입: 세 가지 값만 허용
// ❓ 왜 string이 아닌 리터럴 유니온인가?
//   → filter === 'actve' 같은 오타를 컴파일 타임에 잡아냄
export type FilterType = 'all' | 'active' | 'completed'
