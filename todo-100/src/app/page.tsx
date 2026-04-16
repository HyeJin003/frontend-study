// ─────────────────────────────────────────────────────────────
// 인덱스 페이지: 100가지 학습 목록
//
// 이 파일은 Server Component (기본값)
// → 'use client' 없으면 서버에서 렌더링
// → useState, useEffect 사용 불가 (클라이언트 훅 사용 불가)
// → 데이터베이스 직접 접근, 서버 환경변수 사용 가능
// ─────────────────────────────────────────────────────────────

import Link from 'next/link'

// 타입 정의 — any 사용 절대 금지
// 리터럴 유니온으로 상태를 제한 → 오탈자 방지
type LevelColor =
  | 'green'
  | 'yellow'
  | 'orange'
  | 'blue'
  | 'purple'
  | 'red'
  | 'brown'
  | 'star'
  | 'rocket'

interface TodoVersion {
  id: number      // 01~100
  title: string   // 제목
  keyword: string // 핵심 키워드 (카드에 표시)
  level: LevelColor
}

// 데이터를 컴포넌트 밖에 선언 — 서버에서 한 번만 평가됨
const TODO_VERSIONS: readonly TodoVersion[] = [
  // ── LEVEL 1: React 내장 훅 ──────────────────────────────
  { id: 1,  title: 'useState 기본',              keyword: 'useState',                     level: 'green'  },
  { id: 2,  title: 'useReducer',                 keyword: 'action / reducer',             level: 'green'  },
  { id: 3,  title: 'useContext + useState',       keyword: 'Context API',                  level: 'green'  },
  { id: 4,  title: 'useContext + useReducer',     keyword: '전역 상태 조합',                level: 'green'  },
  { id: 5,  title: '커스텀훅 분리',               keyword: 'useTodos()',                    level: 'green'  },
  { id: 6,  title: 'useRef 활용',                keyword: 'DOM 접근 / 포커스',              level: 'green'  },
  { id: 7,  title: 'useEffect + localStorage',   keyword: '사이드이펙트',                  level: 'green'  },
  { id: 8,  title: 'useCallback',                keyword: '함수 메모이제이션',              level: 'green'  },
  { id: 9,  title: 'useMemo',                    keyword: '값 메모이제이션',               level: 'green'  },
  { id: 10, title: 'React.memo',                 keyword: '컴포넌트 메모이제이션',          level: 'green'  },
  { id: 11, title: 'useLayoutEffect',            keyword: 'DOM 측정 후 동기 처리',         level: 'green'  },
  { id: 12, title: 'useImperativeHandle',        keyword: '자식 메서드 노출',               level: 'green'  },
  { id: 13, title: 'forwardRef',                 keyword: 'ref 전달 패턴',                 level: 'green'  },
  { id: 14, title: 'useId',                      keyword: '고유 ID 생성',                  level: 'green'  },
  { id: 15, title: 'useSyncExternalStore',       keyword: '외부 스토어 구독',               level: 'green'  },
  { id: 16, title: 'useTransition',              keyword: '우선순위 분리',                  level: 'green'  },
  { id: 17, title: 'useDeferredValue',           keyword: '지연 렌더링',                   level: 'green'  },
  { id: 18, title: 'Lifting State Up',           keyword: '상태 끌어올리기',               level: 'green'  },
  { id: 19, title: 'Controlled vs Uncontrolled', keyword: '입력 제어 방식',                level: 'green'  },
  { id: 20, title: '상태 정규화',                keyword: 'Record<id, Todo>',              level: 'green'  },
  // ── LEVEL 2: 컴포넌트 패턴 ──────────────────────────────
  { id: 21, title: 'Compound Components',        keyword: 'Todo.List / Todo.Item',         level: 'yellow' },
  { id: 22, title: 'Render Props',               keyword: 'children as function',          level: 'yellow' },
  { id: 23, title: 'Higher-Order Component',     keyword: 'withLogger(Component)',          level: 'yellow' },
  { id: 24, title: 'Custom Hook 라이브러리',     keyword: 'useToggle / useList',           level: 'yellow' },
  { id: 25, title: '컴포넌트 조합 (Slots)',      keyword: 'children + cloneElement',        level: 'yellow' },
  { id: 26, title: '에러 바운더리',              keyword: 'componentDidCatch',              level: 'yellow' },
  { id: 27, title: 'Suspense + lazy',            keyword: 'dynamic import',                level: 'yellow' },
  { id: 28, title: 'Portal',                     keyword: 'createPortal',                  level: 'yellow' },
  { id: 29, title: '제어역전 (IoC)',             keyword: '동작을 props로 주입',            level: 'yellow' },
  { id: 30, title: 'Headless UI',               keyword: '로직/스타일 분리',               level: 'yellow' },
  { id: 31, title: 'Provider 중첩',             keyword: '여러 Context 조합',              level: 'yellow' },
  { id: 32, title: '상태 머신 (직접 구현)',      keyword: 'state / event / transition',     level: 'yellow' },
  { id: 33, title: 'Observer 패턴',             keyword: '이벤트 버스',                    level: 'yellow' },
  { id: 34, title: 'Command 패턴',              keyword: 'Undo / Redo',                    level: 'yellow' },
  { id: 35, title: 'Factory 패턴',              keyword: '동적 컴포넌트 생성',              level: 'yellow' },
  // ── LEVEL 3: 성능 최적화 ────────────────────────────────
  { id: 36, title: '가상화 (react-window)',      keyword: 'FixedSizeList',                  level: 'orange' },
  { id: 37, title: '가상화 (react-virtuoso)',    keyword: '동적 높이 스크롤',               level: 'orange' },
  { id: 38, title: '디바운스 검색',              keyword: 'setTimeout / clearTimeout',      level: 'orange' },
  { id: 39, title: '스로틀링',                  keyword: '이벤트 최적화',                  level: 'orange' },
  { id: 40, title: 'Web Worker',                keyword: '멀티스레드 연산',                level: 'orange' },
  { id: 41, title: 'requestAnimationFrame',      keyword: '60fps 애니메이션',               level: 'orange' },
  { id: 42, title: 'Immer',                     keyword: 'produce / draft',                level: 'orange' },
  { id: 43, title: '배치 업데이트',             keyword: 'flushSync vs 자동 배치',          level: 'orange' },
  { id: 44, title: '선택적 리렌더',             keyword: '변경 항목만 렌더',               level: 'orange' },
  { id: 45, title: 'Profiler API',              keyword: 'onRender 측정',                  level: 'orange' },
  { id: 46, title: '코드 스플리팅',             keyword: 'dynamic()',                      level: 'orange' },
  { id: 47, title: '이미지 최적화',             keyword: 'next/image',                     level: 'orange' },
  { id: 48, title: '폰트 최적화',               keyword: 'next/font',                      level: 'orange' },
  { id: 49, title: '번들 분석',                keyword: 'bundle-analyzer',                 level: 'orange' },
  { id: 50, title: 'Core Web Vitals',           keyword: 'LCP / CLS / FID',               level: 'orange' },
  // ── LEVEL 4: 상태관리 라이브러리 ────────────────────────
  { id: 51, title: 'Zustand 기본',              keyword: 'create / set',                   level: 'blue'   },
  { id: 52, title: 'Zustand + Immer',           keyword: 'immer 미들웨어',                 level: 'blue'   },
  { id: 53, title: 'Zustand + persist',         keyword: 'localStorage 연동',              level: 'blue'   },
  { id: 54, title: 'Jotai 기본',               keyword: 'atom / useAtom',                  level: 'blue'   },
  { id: 55, title: 'Jotai 파생 atom',          keyword: 'selectAtom',                      level: 'blue'   },
  { id: 56, title: 'Redux Toolkit',             keyword: 'createSlice',                    level: 'blue'   },
  { id: 57, title: 'RTK Query',                keyword: 'createApi',                       level: 'blue'   },
  { id: 58, title: 'Valtio',                   keyword: 'proxy / useSnapshot',             level: 'blue'   },
  { id: 59, title: 'Recoil',                   keyword: 'atom / selector',                 level: 'blue'   },
  { id: 60, title: 'MobX',                     keyword: 'observable / action',             level: 'blue'   },
  { id: 61, title: 'XState',                   keyword: 'createMachine',                   level: 'blue'   },
  { id: 62, title: 'Signals',                  keyword: 'signal / computed',               level: 'blue'   },
  // ── LEVEL 5: 폼 & 유효성 ────────────────────────────────
  { id: 63, title: 'React Hook Form',           keyword: 'register / handleSubmit',        level: 'purple' },
  { id: 64, title: 'Zod 스키마',               keyword: 'z.object / parse',               level: 'purple' },
  { id: 65, title: 'RHF + Zod',               keyword: 'zodResolver',                      level: 'purple' },
  { id: 66, title: 'useFieldArray',            keyword: '동적 필드',                       level: 'purple' },
  { id: 67, title: '다단계 폼',               keyword: '단계별 상태 관리',                 level: 'purple' },
  { id: 68, title: 'Yup',                     keyword: 'Zod vs Yup 비교',                  level: 'purple' },
  // ── LEVEL 6: Next.js 심화 ───────────────────────────────
  { id: 69, title: 'Server Components',        keyword: "'use client' 경계",               level: 'red'    },
  { id: 70, title: 'Server Actions',           keyword: 'revalidatePath',                  level: 'red'    },
  { id: 71, title: 'Route Handlers',           keyword: 'GET / POST API',                  level: 'red'    },
  { id: 72, title: 'Middleware',               keyword: 'matcher / 리다이렉트',             level: 'red'    },
  { id: 73, title: 'SSR',                      keyword: '서버 데이터 패칭',                level: 'red'    },
  { id: 74, title: 'SSG',                      keyword: 'generateStaticParams',             level: 'red'    },
  { id: 75, title: 'ISR',                      keyword: 'revalidate',                       level: 'red'    },
  { id: 76, title: 'Streaming SSR',            keyword: 'loading.tsx / Suspense',           level: 'red'    },
  { id: 77, title: 'Parallel Routes',          keyword: '@slot',                            level: 'red'    },
  { id: 78, title: 'Intercepting Routes',      keyword: '(.)modal',                         level: 'red'    },
  { id: 79, title: 'URL 상태',                keyword: 'useSearchParams',                   level: 'red'    },
  { id: 80, title: 'Metadata API',             keyword: 'generateMetadata',                 level: 'red'    },
  { id: 81, title: 'next/headers',             keyword: 'cookies() / headers()',            level: 'red'    },
  { id: 82, title: 'Edge Runtime',             keyword: "runtime: 'edge'",                  level: 'red'    },
  // ── LEVEL 7: 백엔드 연동 ────────────────────────────────
  { id: 83, title: 'TanStack Query',           keyword: 'useQuery / useMutation',           level: 'brown'  },
  { id: 84, title: 'Optimistic Updates',       keyword: 'onMutate / rollback',              level: 'brown'  },
  { id: 85, title: 'SWR',                      keyword: 'stale-while-revalidate',           level: 'brown'  },
  { id: 86, title: 'Supabase',                keyword: 'select / 실시간 구독',              level: 'brown'  },
  { id: 87, title: 'Prisma + SQLite',          keyword: 'ORM / migrate',                    level: 'brown'  },
  { id: 88, title: 'Firebase Firestore',       keyword: 'onSnapshot',                       level: 'brown'  },
  { id: 89, title: 'next-auth',               keyword: 'Session / 개인 Todo',               level: 'brown'  },
  { id: 90, title: 'WebSocket',               keyword: '실시간 다중 사용자',                level: 'brown'  },
  // ── LEVEL 8: UI/UX ──────────────────────────────────────
  { id: 91, title: 'Framer Motion',           keyword: 'AnimatePresence',                   level: 'star'   },
  { id: 92, title: '@dnd-kit',               keyword: '드래그 앤 드롭 정렬',                level: 'star'   },
  { id: 93, title: '다크모드',               keyword: 'CSS 변수 / prefers-color-scheme',    level: 'star'   },
  { id: 94, title: '접근성 (a11y)',          keyword: 'ARIA / 키보드 내비게이션',           level: 'star'   },
  { id: 95, title: '스켈레톤 UI',            keyword: '로딩 상태 UX',                       level: 'star'   },
  { id: 96, title: 'Toast 알림',            keyword: 'react-hot-toast',                     level: 'star'   },
  // ── LEVEL 9: 테스트 & 고급 ──────────────────────────────
  { id: 97,  title: 'React Testing Library', keyword: 'render / userEvent',                 level: 'rocket' },
  { id: 98,  title: 'Playwright E2E',        keyword: '브라우저 자동화 테스트',              level: 'rocket' },
  { id: 99,  title: 'PWA',                  keyword: 'service worker / 오프라인',           level: 'rocket' },
  { id: 100, title: 'Claude AI 연동',        keyword: '자연어 Todo 추가/분류',              level: 'rocket' },
] as const

// 레벨별 색상 + 이름 매핑
const LEVEL_META: Record<LevelColor, { bg: string; border: string; badge: string }> = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700'  },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700'},
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700'},
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700'   },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700'},
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700'     },
  brown:  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700' },
  star:   { bg: 'bg-pink-50',   border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700'   },
  rocket: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700'},
}

// id를 두 자리 문자열로: 1 → '01', 10 → '10'
function padId(id: number): string {
  return String(id).padStart(2, '0')
}

export default function IndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Todo 100번 완전정복
        </h1>
        <p className="mt-3 text-gray-500">
          동일한 Todo를 {TODO_VERSIONS.length}가지 방법으로 구현하며 React를 체득합니다
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TODO_VERSIONS.map((version) => {
          const meta = LEVEL_META[version.level]
          const href = `/${padId(version.id)}`

          return (
            <li key={version.id}>
              <Link
                href={href}
                className={`
                  flex items-start gap-3 rounded-xl border p-4
                  transition-shadow duration-150 hover:shadow-md
                  ${meta.bg} ${meta.border}
                `}
              >
                <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${meta.badge}`}>
                  {padId(version.id)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800">{version.title}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{version.keyword}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <p className="mt-10 text-center text-sm text-gray-400">
        총 {TODO_VERSIONS.length}개 · 완료한 항목은 todo-practice/STUDY_GUIDE.md에서 체크하세요
      </p>
    </main>
  )
}
