'use client'

// ✋ 03b 안보고 치기: Context를 직접 구현하세요
// TodoContextValue, TodoProvider, useTodoContext 모두 직접 설계하세요

export function TodoProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useTodoContext() {
  // TODO
  throw new Error('구현 필요')
}
