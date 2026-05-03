# 📚 Auth 20번 정답지 — 학습 가이드

> **핵심 마인드셋**
> "일단 돌아가면 됐지" → 취직 안 됨
> "왜 이렇게 짰는지 면접에서 설명할 수 있다" → 합격

---

## 정답지 사용 3단계

### Step 1 — 파일 읽는 순서

각 번호 폴더 `src/app/XX/` 에서 **반드시 이 순서대로** 읽는다.

```
1. types.ts         → 타입/인터페이스 구조 먼저 파악
2. lib/auth.ts      → (04번~) 인증 핵심 로직 이해
3. api/route.ts     → (03번~) API 엔드포인트 구조 이해
4. auth.config.ts   → (05번~) next-auth 설정 이해
5. page.tsx         → 최종적으로 컴포넌트 연결 방식 확인
6. components/      → 각 자식 컴포넌트가 뭘 받는지 확인
```

왜 이 순서인가:
- `types.ts`를 먼저 읽어야 나머지 파일의 타입이 눈에 들어옴
- `page.tsx`를 먼저 읽으면 인증 로직의 이유를 모른 채 결과만 봄
- 컴포넌트는 마지막 — "무엇을 props로 받는지"가 이미 설계 완료된 이후에 확인

---

### Step 2 — 주석의 "왜?"를 생각하며 읽기

코드를 읽기 전, 먼저 자신에게 물어본다:

> "이 코드 없이 어떻게 짰을까? 그리고 왜 이렇게 바꿨을까?"

#### 주석 표시 읽는 법

| 표시 | 의미 | 어떻게 읽나 |
|------|------|------------|
| `// ← 03번:` | 이전 버전과 달라진 지점 | "왜 여기서 이걸 바꿨나?" |
| `// ── 이 파일을 설계할 때 한 고민` | 설계 과정 | 각 번호 앞에서 "나라면 어떻게 했을까?" 먼저 생각 |
| `// ── 면접 포인트` | 실제 면접 답변 | 소리 내어 읽고 암기하지 말고 이해할 것 |
| `// 왜 ~인가?` | 이 선택의 이유 | 납득될 때까지 멈출 것. 넘어가지 말 것 |
| `// ❌` / `// ✅` | 안 되는 것 / 되는 것 | 둘의 차이가 무엇인지 말로 설명해볼 것 |

#### 올바른 읽기 방법

```
❌ 코드를 눈으로 쭉 훑고 "이해했다" 하고 넘어가기
❌ 주석을 읽지 않고 코드 구조만 파악하기
❌ 이해 안 되는 부분에서 그냥 넘어가기

✅ 주석의 "왜?"를 읽고 납득이 되면 다음 줄
✅ 이해 안 되는 주석 앞에서 멈추고 문서 찾기
✅ 각 파일 읽은 후 핵심 1~2문장으로 요약해보기
```

이해 안 되는 주석 앞에서 **멈추는 것**이 학습이다.
넘어가는 것은 그냥 눈 운동이다.

---

### Step 3 — 이해 안 되면 문서에서 찾기

#### next-auth 공식 문서

> 주소: **https://authjs.dev**

| 주제 | 문서 경로 |
|------|----------|
| 기본 설정 | authjs.dev/getting-started |
| Credentials Provider | authjs.dev/getting-started/providers/credentials |
| Google Provider | authjs.dev/getting-started/providers/google |
| 세션 사용 (클라이언트) | authjs.dev/getting-started/session-management/get-session |
| 미들웨어 | authjs.dev/getting-started/session-management/protecting |
| Callbacks | authjs.dev/guides/extending-the-session |

#### MDN (Web API)

| 코드에서 본 것 | MDN 검색어 |
|--------------|-----------|
| `cookies.set()` | MDN Set-Cookie |
| `btoa`, `atob` | MDN btoa |
| `crypto.subtle` | MDN SubtleCrypto |
| `Response.redirect()` | MDN Response redirect |

---

## 챕터별 정답지 구성

---

### 📗 챕터 1 — 기초 로그인 UI (01~05번)

**학습 목표:** 로그인/회원가입 폼을 만들고, next-auth로 이메일 인증을 구현할 수 있다

**이 챕터에서 증명해야 할 것:**
- "제어 컴포넌트(Controlled)와 비제어 컴포넌트(Uncontrolled)의 차이가 뭔가?"
- "React Hook Form을 왜 쓰나? useState로 하면 안 되나?"
- "JWT를 httpOnly 쿠키에 저장하는 이유가 뭔가? localStorage는 왜 안 되나?"
- "next-auth Credentials Provider가 하는 일이 뭔가?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 01 | types.ts + page.tsx + components/ | useState로 로그인 폼 (이메일/비밀번호/에러) |
| 02 | types.ts + page.tsx + components/ | React Hook Form + Zod 회원가입 폼 |
| 03 | types.ts + app/api/auth/route.ts + page.tsx | Next.js Route Handlers (POST /api/auth/login) |
| 04 | types.ts + lib/auth.ts + middleware.ts + page.tsx | JWT 직접 구현 (생성/검증/httpOnly 쿠키) |
| 05 | auth.config.ts + auth.ts + page.tsx | next-auth Credentials Provider 기본 설정 |

**읽을 때 집중할 주석:**
- 01 → 02: "왜 useState 대신 React Hook Form을 쓰나?" — 리렌더 횟수 차이
- 03 route.ts: "왜 GET이 아닌 POST인가?" — 자격증명은 body에 담아야 함
- 04 lib/auth.ts: "왜 localStorage가 아닌 httpOnly 쿠키인가?" — XSS 공격 방어
- 05 auth.ts: "authorize 함수가 하는 일이 뭔가?"

**공식 문서:** authjs.dev/getting-started/providers/credentials

---

### 📗 챕터 2 — 소셜 로그인 (06~10번)

**학습 목표:** OAuth 2.0 흐름을 이해하고, 카카오/네이버/구글 소셜 로그인을 구현할 수 있다

**이 챕터에서 증명해야 할 것:**
- "OAuth 2.0 Authorization Code Flow가 뭔가? 왜 이 방식을 쓰나?"
- "카카오 Custom Provider를 직접 만들 때 뭘 설정해야 하나?"
- "같은 이메일로 다른 소셜 계정이 오면 어떻게 처리하나?"
- "session callback과 jwt callback의 차이가 뭔가?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 06 | auth.config.ts + page.tsx | Google Provider — OAuth 동의 화면, scope |
| 07 | auth.config.ts + page.tsx | Kakao Custom Provider — authorization/token/userinfo URL |
| 08 | auth.config.ts + page.tsx | Naver Custom Provider — state 파라미터, 프로필 파싱 |
| 09 | auth.config.ts + lib/account.ts + page.tsx | 소셜 + 이메일 계정 연동 (signIn callback) |
| 10 | auth.config.ts + page.tsx + components/ | 세션에서 프로필 정보 활용 (session callback) |

**읽을 때 집중할 주석:**
- 06 auth.config.ts: "왜 GOOGLE_CLIENT_ID를 .env에 넣나?" — 클라이언트에 노출 금지
- 07: "Kakao Custom Provider의 profile() 함수가 하는 일이 뭔가?"
- 09 lib/account.ts: "계정 병합 시 기존 사용자를 어떻게 찾나?"
- 10: "jwt callback → session callback 순서로 실행되는 이유는?"

**공식 문서:**
- authjs.dev/getting-started/providers/kakao
- authjs.dev/getting-started/providers/naver
- authjs.dev/guides/extending-the-session

---

### 📗 챕터 3 — 세션 & 미들웨어 (11~15번)

**학습 목표:** 세션 전략을 선택하고, 미들웨어로 보호된 라우트를 구현할 수 있다

**이 챕터에서 증명해야 할 것:**
- "JWT strategy와 Database strategy의 차이가 뭔가? 언제 어느걸 쓰나?"
- "middleware.ts에서 auth를 체크하는 방법이 뭔가?"
- "RBAC(Role-Based Access Control)을 next-auth로 어떻게 구현하나?"
- "세션 만료 시간을 어떻게 설정하나?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 11 | auth.config.ts + page.tsx + components/ | JWT strategy — useSession, SessionProvider |
| 12 | auth.config.ts + prisma/schema.prisma + page.tsx | Database strategy — Prisma Adapter |
| 13 | middleware.ts + auth.config.ts | 미들웨어로 보호된 라우트 (미인증 → 로그인 리다이렉트) |
| 14 | middleware.ts + auth.config.ts + page.tsx | Role 기반 접근 제어 (admin/user) |
| 15 | auth.config.ts + page.tsx + components/ | Remember me — 세션 만료 시간 동적 설정 |

**읽을 때 집중할 주석:**
- 11: "왜 SessionProvider를 layout.tsx에 넣나?"
- 12: "Database strategy를 쓰면 성능이 왜 느려질 수 있나?"
- 13 middleware.ts: "matcher 설정이 왜 중요한가?"
- 14: "token.role을 session에 어떻게 넘기나?"

**공식 문서:** authjs.dev/getting-started/session-management/protecting

---

### 📗 챕터 4 — 심화 (16~20번)

**학습 목표:** 토큰 갱신, 이메일 발송, 프로필 관리까지 완성된 인증 시스템을 구현할 수 있다

**이 챕터에서 증명해야 할 것:**
- "Refresh Token이 왜 필요한가? Access Token만 쓰면 안 되나?"
- "비밀번호 재설정 토큰을 왜 DB에 저장하나?"
- "bcrypt로 비밀번호를 해시하는 이유가 뭔가?"
- "이메일 인증 없이 회원가입을 허용하면 무슨 문제가 생기나?"

| 번호 | 파일 구성 | 핵심 |
|------|----------|------|
| 16 | auth.config.ts + lib/token.ts | Refresh Token — jwt callback에서 자동 갱신 |
| 17 | auth.config.ts + api/signout/route.ts | 전체 기기 로그아웃 — DB 세션 무효화 |
| 18 | api/reset-password/route.ts + lib/email.ts | 비밀번호 재설정 — Resend API, 토큰 만료 |
| 19 | api/verify-email/route.ts + lib/email.ts | 이메일 인증 — 인증 전 기능 제한 |
| 20 | api/profile/route.ts + page.tsx + components/ | 프로필 수정 + 비밀번호 변경 |

**읽을 때 집중할 주석:**
- 16 lib/token.ts: "accessToken 만료 시간을 어떻게 감지하나?"
- 18: "비밀번호 재설정 토큰을 해시해서 저장하는 이유?"
- 19: "미인증 계정을 signIn callback에서 어떻게 막나?"
- 20: "현재 비밀번호 확인을 왜 서버에서 하나? 클라이언트에서 하면 안 되나?"

---

## 컴포넌트 설계 기준

> 인증 관련 컴포넌트에 뭘 넣을지 모를 때 이 순서로 생각할 것

1. 이 컴포넌트가 **화면에 그리는 게** 뭔가? → 그것만 보여주면 됨
2. 그걸 그리는 데 **필요한 데이터**가 뭔가? → 그것만 props/session으로 받으면 됨
3. **민감한 정보(비밀번호, 토큰)는 절대 state에 오래 두지 않는다**
4. **서버에서 해야 할 일(비밀번호 검증, 토큰 생성)을 클라이언트에서 하지 않는다**

```
LoginForm     → email + password 입력, onSubmit
SignupForm    → email + password + confirm 입력, Zod 유효성 검사
UserProfile   → session.user (이름/이메일/이미지)
AuthButton    → session 유무에 따라 로그인/로그아웃 버튼
```

---

## 코드 작성 규칙

- TypeScript `any` 절대 금지 — 정확한 타입을 정의할 것
- 환경변수(`process.env.XXX`)는 서버에서만 — 클라이언트에 노출 금지
- 비밀번호는 평문 저장 절대 금지 — 항상 bcrypt 해시
- 모든 "왜"를 주석으로 설명 — **무엇(what)** 이 아닌 **이유(why)** 를 주석에 적을 것

---

## 다음 번호로 넘어가는 기준

```
✅ 이 인증 흐름이 왜 이렇게 동작하는지 말로 설명할 수 있다
✅ 비슷한 상황에서 이 패턴을 떠올릴 수 있다
✅ 면접 포인트 Q에 A를 보지 않고 대답할 수 있다
→ 다음 번호로 이동

❌ 코드가 어떻게 동작하는지는 알지만 왜 이렇게 짰는지 모른다
→ auth.config.ts / lib/auth.ts 설계 고민 주석 다시 읽기
```
