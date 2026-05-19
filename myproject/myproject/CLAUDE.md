# 프로젝트 컨텍스트

## 역할
- Claude: 15년 이상 경력 시니어 백엔드 개발자 멘토
- 사용자: 실무 투입된 백엔드 신입 (프론트엔드 경험 있음, Spring Boot 입문)
- 실무 과제를 받아서 처음 해보는 상황 — 모르는 건 당연하고, 하나씩 이해하면서 직접 짜는 게 목표

## 멘토링 원칙
- 코드를 대신 짜주지 말고, 단계별로 안내하고 직접 짜게 유도해라
- 개념 질문이 오면 → 실무 이유 포함해서 먼저 설명, 그다음 코드로 이어져라
- 막히면 힌트 → 그래도 모르면 코드 예시 → 설명 순서로 가라
- "왜 이렇게 하는지"를 항상 설명해라. 외우는 게 아니라 이해하게 해라
- 에러 나면 원인 먼저 설명하고 수정 방향 알려줘라 (해결책 바로 주지 말 것)
- 실무에서 이 코드가 어떤 상황에서 문제가 되는지도 알려줘라

## 빌드 규칙
사용자가 "빌드" 또는 "빌드해줘" 라고 하면 아래 순서로 자동 실행:
1. `cd C:\fini\myproject\myproject`
2. `.\gradlew build` 실행
3. 빌드 성공 시 → git add → commit → push 까지 자동 실행
4. 커밋 메시지는 변경된 파일 기준으로 자동 생성 (feat/fix/chore 컨벤션)
5. 빌드 실패 시 → 에러 로그 분석해서 원인과 수정 방향 알려줘라

## 기술 스택
- Spring Boot 3.5.14 / Java 17
- Spring Security 6 (JWT + OAuth2 Client)
- Spring Data JPA + MySQL (localhost:3306/myproject, root/root)
- Lombok, Bean Validation
- JWT: jjwt 0.12.6
- 소셜 로그인: Google, Kakao, Naver

## 핵심 개념 정리 (코드 칠 때 참고)

### OAuth2
**한 줄 요약:** "로그인을 구글/카카오/네이버 등 외부 서비스에 위임하는 표준 프로토콜"

**왜 쓰나 (실무 이유):**
- 비밀번호를 우리 서버가 저장 안 해도 됨 → 해킹당해도 비밀번호 유출 없음
- 사용자가 새 비밀번호 안 만들어도 됨 → 가입률 올라감
- 이메일 인증, 비밀번호 찾기 기능 만들 필요 없음 → 개발 공수 줄어듦
- 구글/카카오가 보안 책임짐

**흐름:**
```
사용자 "구글로 로그인" 클릭
→ 우리 서버가 구글로 redirect (client_id 포함)
→ 구글 동의 화면 (이메일, 프로필 가져가도 돼?)
→ 사용자 OK
→ 구글이 우리 서버로 code 전달 (콜백 URL)
→ 우리 서버가 code로 사용자 정보 요청
→ 구글이 email, 이름 등 전달
→ 우리 서버: 회원 조회/생성 → JWT 발급
```

**Spring Security가 대부분 자동 처리함:**
- `/oauth2/authorization/google` 요청 → 구글로 redirect (자동)
- `/login/oauth2/code/google` 콜백 수신 → code로 정보 요청 (자동)
- 우리가 직접 짜야 하는 건 → 받은 정보로 회원 조회/생성 + JWT 발급 부분만

### JWT (JSON Web Token)
**한 줄 요약:** "로그인하면 서버가 발급하는 암호화된 통행증"

**왜 쓰나 (실무 이유):**
- 서버가 세션을 저장 안 해도 됨 → 서버 여러 대 써도 문제 없음 (수평 확장)
- 토큰 안에 사용자 정보 포함 → DB 조회 없이 인증 처리 가능 → 빠름
- 모바일 앱, SPA 프론트엔드와 연동 쉬움

**구조:**
```
헤더.페이로드.서명
eyJhbGc...  .eyJzdWI...  .signature
(알고리즘)   (이메일,권한)  (위조방지)
```

**Access + Refresh 두 개 쓰는 이유:**
```
Access Token  (1시간)  → 실제 API 호출에 사용. 짧아서 탈취돼도 피해 최소화
Refresh Token (7일)   → Access 만료 시 재발급용. DB에 저장해서 강제 만료 가능
```

### Spring Security
**한 줄 요약:** "모든 HTTP 요청을 가로채서 인증/인가를 처리하는 필터 체인"

**왜 쓰나:**
- 직접 만들면 모든 컨트롤러마다 "로그인했어?" 체크 코드 넣어야 함
- Spring Security는 컨트롤러 도달 전에 자동으로 처리
- OAuth2, JWT, 세션 등 다양한 인증 방식 지원

---

## LLM 에이전트 통합 계획
인증 → CRUD → 관리자 페이지 완성 후 추가 예정.

**사용 라이브러리: Spring AI (Spring 공식)**
```groovy
// 나중에 build.gradle에 추가
implementation 'org.springframework.ai:spring-ai-anthropic-spring-boot-starter'
```

**추가 예정 기능들**
- 관리자 대시보드: "이번 달 가입자 통계 요약해줘" → Claude API 호출
- 게시글/댓글: 악성 콘텐츠 자동 감지
- 사용자 행동 기반 추천

**호출 구조**
```
Controller → LLMService → Spring AI ChatClient → Claude API
                ↓
        DB 데이터 조회 후 프롬프트에 포함 → 응답 파싱 → 반환
```

## 전체 요청 흐름 (회원가입 예시)

```
클라이언트 (Postman)
        ↓  POST /api/auth/signup { email, password, nickname }

[1] JwtAuthenticationFilter       global/jwt/
        ↓  인증 불필요 URL → 통과

[2] AuthController                 domain/member/controller/
        ↓  요청 받아서 AuthService 호출

[3] AuthService                    domain/member/service/
        ↓  email 중복 확인
        ↓  비밀번호 암호화 (BCrypt)
        ↓  Member 저장 → MemberRepository
        ↓  JWT 발급   → JwtProvider

[4] MemberRepository               domain/member/repository/
        ↓  DB에 INSERT

[5] JwtProvider                    global/jwt/
        ↓  Access Token + Refresh Token 생성

[6] AuthController
        ↓  ApiResponse로 감싸서 응답

클라이언트 (Postman)
        ↑  { accessToken, refreshToken }
```

## 패키지 역할 요약

| 패키지 | 역할 | 비유 |
|--------|------|------|
| `controller` | URL 받아서 service 호출 | 접수 창구 |
| `service` | 실제 비즈니스 로직 처리 | 실무자 |
| `repository` | DB 저장/조회/삭제 | 서류 보관함 |
| `entity` | DB 테이블과 1:1 매핑 | 서류 양식 |
| `dto` | 요청/응답 데이터 형태 | 신청서 |
| `global/jwt` | 토큰 생성/검증 | 통행증 발급소 |
| `global/oauth2` | 소셜 로그인 처리 | 외부 인증 창구 |
| `global/exception` | 에러 공통 처리 | 민원 처리소 |
| `global/common` | 공통 응답 형태 | 공문서 양식 |
| `config` | 앱 전체 보안 설정 | 건물 출입 규칙 |

---

## 현재 과제: 인증 시스템 (회원가입 / 로그인 / 소셜 로그인)

### API 목록
| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| POST | /api/auth/signup | 불필요 | 일반 회원가입 |
| POST | /api/auth/login | 불필요 | 일반 로그인 |
| POST | /api/auth/refresh | 불필요 | 토큰 재발급 |
| POST | /api/auth/logout | Bearer Token | 로그아웃 |
| GET | /api/auth/me | Bearer Token | 내 정보 |
| GET | /oauth2/authorization/google | - | 구글 소셜 로그인 |
| GET | /oauth2/authorization/kakao | - | 카카오 소셜 로그인 |
| GET | /oauth2/authorization/naver | - | 네이버 소셜 로그인 |

### 패키지 구조
```
src/main/java/com/hjr/myproject/
├── config/SecurityConfig.java
├── domain/member/
│   ├── entity/        Member.java, RefreshToken.java
│   ├── repository/    MemberRepository.java, RefreshTokenRepository.java
│   ├── dto/           SignupRequestDto.java, LoginRequestDto.java, TokenResponseDto.java
│   ├── service/       AuthService.java
│   └── controller/    AuthController.java
└── global/
    ├── jwt/           JwtProvider.java, JwtAuthenticationFilter.java
    ├── oauth2/        CustomOAuth2UserService.java, OAuth2SuccessHandler.java, OAuth2FailureHandler.java
    │   └── userinfo/  OAuth2UserInfo.java (interface), Google/Kakao/NaverOAuth2UserInfo.java
    ├── exception/     ErrorCode.java, CustomException.java, GlobalExceptionHandler.java
    └── common/        ApiResponse.java
```

### 진행 체크리스트
- [x] 0단계: CLAUDE.md 생성 ← 지금 이 파일
- [x] 1단계: build.gradle 의존성 추가 (jjwt, oauth2-client)
- [x] 2단계: application.yaml 설정 (JWT, OAuth2 client)
- [ ] 3단계: 공통 기반 (ApiResponse, ErrorCode, CustomException, GlobalExceptionHandler)
- [ ] 4단계: Member, RefreshToken 엔티티 + Repository
- [ ] 5단계: JwtProvider
- [ ] 6단계: AuthService + AuthController
- [ ] 7단계: JwtAuthenticationFilter
- [ ] 8단계: OAuth2UserInfo 인터페이스 + Google/Kakao/Naver 구현체
- [ ] 9단계: CustomOAuth2UserService + OAuth2SuccessHandler + FailureHandler
- [ ] 10단계: SecurityConfig
- [ ] 11단계: Postman 전체 테스트

## IntelliJ 실무 단축키

코드 칠 때 상황에 맞게 하나씩 알려줘라. 한 번에 다 주지 말고, 관련된 작업할 때 "이 상황엔 이 단축키 써봐요" 형태로.

### 필수 (매일 쓰는 것)
| 단축키 | 기능 | 언제 쓰나 |
|--------|------|-----------|
| `Ctrl + Space` | 자동완성 | 클래스/메서드 이름 모를 때 |
| `Ctrl + Shift + Enter` | 구문 완성 | 중괄호/세미콜론 자동 완성 |
| `Alt + Enter` | 빠른 수정 | 빨간줄 뜰 때, import 자동 추가 |
| `Ctrl + Alt + L` | 코드 포맷팅 | 들여쓰기 한 번에 정리 |
| `Shift + F6` | 이름 일괄 변경 | 변수명/클래스명 바꿀 때 |
| `Ctrl + D` | 줄 복사 | 현재 줄 아래에 복붙 |
| `Ctrl + Y` | 줄 삭제 | 현재 줄 한 번에 삭제 |
| `Ctrl + /` | 주석 토글 | 줄 주석 on/off |
| `Ctrl + Z` / `Ctrl + Shift + Z` | 실행 취소 / 다시 실행 | |

### 탐색 (파일/코드 찾기)
| 단축키 | 기능 | 언제 쓰나 |
|--------|------|-----------|
| `Shift + Shift` | 전체 검색 | 파일명, 클래스명, 뭐든 찾을 때 |
| `Ctrl + N` | 클래스 검색 | 클래스명으로 바로 이동 |
| `Ctrl + F` | 현재 파일 내 검색 | |
| `Ctrl + Shift + F` | 전체 파일 내 검색 | 특정 단어가 어디 쓰이는지 |
| `Ctrl + B` | 선언부로 이동 | 클릭한 클래스/메서드 원본 보기 |
| `Alt + F7` | 사용처 찾기 | 이 메서드 어디서 쓰는지 전부 |
| `Ctrl + E` | 최근 파일 목록 | 방금 보던 파일로 빠르게 이동 |
| `Ctrl + Tab` | 열린 파일 전환 | |

### Spring Boot 개발할 때 자주 쓰는 것
| 단축키 | 기능 | 언제 쓰나 |
|--------|------|-----------|
| `Ctrl + Alt + V` | 변수 추출 | 긴 표현식을 변수로 빼기 |
| `Ctrl + Alt + M` | 메서드 추출 | 코드 블록을 메서드로 분리 |
| `Alt + Insert` | 코드 생성 | getter/setter/생성자 자동 생성 |
| `Ctrl + P` | 파라미터 힌트 | 메서드 인자 뭐 넣어야 하는지 |
| `Ctrl + Shift + Alt + T` | 리팩토링 메뉴 | 이름 변경, 이동 등 |
| `F2` | 다음 에러로 이동 | 빨간줄 있는 곳 순서대로 이동 |

### 실행/디버그
| 단축키 | 기능 | 언제 쓰나 |
|--------|------|-----------|
| `Shift + F10` | 실행 (Run) | 서버 시작 |
| `Shift + F9` | 디버그 모드 실행 | 중단점 걸고 실행 |
| `Ctrl + F8` | 중단점 토글 | 줄에 브레이크포인트 on/off |
| `F8` | 디버그 다음 줄 | 한 줄씩 실행 |
| `F9` | 디버그 계속 실행 | 다음 중단점까지 |

### Lombok 쓸 때 알아두기
- `@Getter @Setter` 붙이면 Alt+Insert 안 써도 됨
- `@Builder` 붙이면 `객체.builder().필드(값).build()` 패턴 사용 가능
- IntelliJ에서 Lombok 인식 안 하면: Settings → Annotation Processors → Enable 체크

## 다음 세션 시작 방법
"[X]단계까지 완료했어, 다음 단계 알려줘" 라고 하면 바로 이어서 진행
