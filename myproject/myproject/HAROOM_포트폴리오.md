# Haroom — 포트폴리오

---

## 1. 메인 소개

> **현대판 싸이월드. 나만의 미니홈피에서 일상을 기록하고, 매일 새로운 한 사람과 연결되는 플랫폼.**

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Haroom (하루 + 룸 = 오늘의 내 공간) |
| 개발 기간 | 2025.xx ~ 진행 중 |
| 개발 인원 | 1인 (풀스택) |
| GitHub | (링크 추가 예정) |

**기획 배경**
- 디지털 전환 이후 단절된 사람 간의 연결을 되살리고 싶었음
- 예전 싸이월드의 "온기 있는 연결" 감성을 현대적 기능으로 재해석
- 랜덤 매칭 → 24시간 한정 연결 → 친구 신청으로 이어지는 플로우가 핵심

---

## 2. 핵심 기능

### 완성
- **회원가입 / 로그인** — JWT 기반 자체 인증
- **소셜 로그인** — Google / Kakao / Naver OAuth2 연동
- **토큰 관리** — Access Token(1h) + Refresh Token(7d) 재발급 흐름
- **회원 정보 관리** — 프로필 조회 / 수정 / 비밀번호 변경 / 탈퇴
- **방명록 (Guestbook)** — 익명 지원, 홈피 주인만 삭제 가능
- **글 (Post)** — 작성 / 목록(페이징, 공개글만) / 단건조회(조회수 증가) / 수정(부분 수정) / 삭제, 작성자 본인 권한 체크
- **추천/비추천 (PostLike)** — 토글 방식 (같은 타입 재호출 시 취소, 다른 타입 누르면 변경), COUNT로 실시간 집계
- **댓글 (Comment)** — 작성 / 목록(페이징) / 삭제, 작성자 본인 권한 체크

### 진행 중
- **타임캡슐** — 날짜 잠금 글, D-day 자동 공개 (Entity + Repository 완성, DTO → Service → Controller 작업 중)

### 구현 예정
- **내 공간 (미니홈피)** — 글 / 방명록 / 타임캡슐로 구성된 나만의 공간
- **인기글 TOP5 / 유저별 글 목록** — 프론트 연동 시 추가
- **랜덤 연결** — 매일 랜덤 1인 매칭, 24시간 후 자동 만료
- **친구** — 랜덤 연결 상대에게 친구 신청 → 영구 연결

---

## 3. 기술 스택

| 기술 | 사용 이유 |
|------|----------|
| **Spring Boot 3.5** | 빠른 서버 세팅과 자동 설정으로 비즈니스 로직에 집중 가능 |
| **Spring Security 6** | 인증/인가 필터 체인을 체계적으로 관리하기 위해 도입 |
| **JWT (jjwt 0.12.6)** | 서버 무상태(stateless) 유지 + Access/Refresh 분리로 보안과 UX 균형 |
| **OAuth2 Client** | 소셜 로그인 흐름(Authorization Code Grant)을 Spring이 표준화된 방식으로 처리해줌 |
| **Spring Data JPA** | 반복적인 SQL 없이 객체 중심으로 DB 접근, 연관관계 매핑 용이 |
| **MySQL** | 관계형 데이터 구조(회원-글-댓글-친구 등 FK 관계)에 적합 |
| **Lombok** | 반복 보일러플레이트(getter/setter/builder) 제거로 코드 가독성 향상 |
| **Swagger (springdoc 2.8)** | API 문서 자동화 + 브라우저 테스트로 프론트 연동 전 빠른 검증 |

---

## 4. 아키텍처 및 설계 결정

### 패키지 구조 — 도메인 중심 설계
```
domain/
  member/   → 회원
  post/     → 글 + 추천
  comment/  → 댓글
  guestbook/→ 방명록
  timecapsule/
  match/
  friendship/
global/
  jwt/      → 토큰 생성·검증
  oauth2/   → 소셜 로그인 처리
  exception/→ 공통 예외
  common/   → 공통 응답 형식
```
- 기능별이 아닌 도메인별로 묶어 응집도를 높임
- 새 도메인 추가 시 다른 도메인에 영향 없이 독립적으로 확장 가능

### 추천/비추 — 별도 테이블 + 토글 설계
- posts에 `like_count` 컬럼으로 관리하면 **동시 요청 시 레이스 컨디션** 발생
- `post_likes` 별도 테이블 + `UNIQUE KEY(post_id, member_id)` 로 해결
  - 중복 추천 DB 레벨 차단
  - 추천수는 COUNT 쿼리로 계산 → 항상 정확한 값 보장
- 토글 로직: 기존 기록 없음 → INSERT / 같은 타입 → DELETE / 다른 타입 → UPDATE (changeType)
  - JPA Dirty Checking 활용 — `changeType()` 호출 후 `save()` 없이 자동 UPDATE

### 댓글 — Post와 연관관계 설계
- `Comment`는 `Post`와 `@ManyToOne` 관계 → `post_id FK`로 연결
- 댓글 목록 조회: `findByPost(post, pageable)` — JPA 메서드 이름으로 자동 SQL 생성
- DTO 설계: `CommentRequest`는 `content`만, `CommentResponse`는 `comment.getMember().getNickname()`으로 작성자 정보 포함
  - 엔티티를 DTO에 직접 담으면 순환참조 → 필요한 필드만 추출해서 반환

### 방명록 익명 처리
- `writer_id`를 NULL로 저장하면 어뷰징/신고 시 추적 불가
- 익명이어도 `writer_id`는 항상 저장, **화면에만 미표시**
- 서버는 알고, 사용자에게만 익명으로 보임

### 친구 vs 팔로우
- 팔로우는 범용 SNS 기능 → Haroom 컨셉("온기 있는 연결")과 방향이 다름
- 싸이월드 1촌 개념에 맞게 **친구(양방향 동의)만 유지**
- 랜덤 연결 → 친구 신청 스토리라인을 강화

---

## 5. 요청 처리 흐름

```
클라이언트 요청 (Authorization: Bearer {token})
    ↓
[JwtAuthenticationFilter]   토큰 검증 → SecurityContext에 email 저장
    ↓
[Controller]                Authorization 헤더에서 토큰 추출 → Service로 그대로 전달
    ↓
[Service]                   토큰에서 email 추출(JwtProvider) → 회원 조회 → 비즈니스 로직 수행
    ↓
[Repository]                DB 저장/조회
    ↓
[Controller]                ApiResponse<T>로 감싸서 응답
```

> `@AuthenticationPrincipal`로 SecurityContext에서 직접 꺼내는 대신, 토큰 문자열을 Controller → Service까지 그대로 넘기고 Service 내부에서 파싱하는 방식을 Member/Post 도메인에 일관되게 적용. (각 Service가 인증 로직에 대한 의존을 직접 갖는 대신, Controller 책임을 명확히 분리하기 위한 선택)

---

## 6. 트러블 슈팅

### OAuth2 소셜 로그인 후 JWT 발급 흐름 문제
**상황**
- 소셜 로그인 성공 후 기존 일반 로그인과 동일하게 JWT를 발급해야 했음
- Spring Security의 OAuth2 성공 핸들러와 JWT 발급 로직을 어떻게 연결할지 불명확

**해결**
- `OAuth2SuccessHandler`에서 인증된 `OAuth2User`를 받아 DB 회원 조회/자동 생성 후 JWT 발급
- provider별 사용자 정보 구조가 달라 (`OAuth2UserInfo` 인터페이스 → Google/Kakao/Naver 각 구현체) 추상화로 해결

**배운 점**
- 소셜마다 응답 필드명이 다름 (Google: `email`, Kakao: `kakao_account.email`)
- 인터페이스로 추상화하면 provider 추가 시 기존 코드 수정 없이 구현체만 추가하면 됨

---

### Jackson과 Lombok의 boolean getter 명명 규칙 충돌로 필드가 조용히 무시되는 버그
**상황**
- `PostCreateRequest`에 `private boolean isPublic` 필드를 두고 `{"isPublic": true}`로 글 작성 요청을 보냈는데, 실제 DB에는 항상 `false`로 저장됨. 에러는 전혀 발생하지 않음

**원인**
- Lombok이 `boolean isPublic` 필드에 `isPublic()` getter를 생성 — boolean 전용 명명 규칙으로 "is" 접두사를 제거하지 않고 그대로 둠
- Jackson은 `isXxx()` 형태의 getter를 만나면 논리적 속성명을 `Xxx`(앞의 "is" 제거)로 인식 → 이 필드의 JSON 키를 `isPublic`이 아닌 `public`으로 기대
- 클라이언트가 보낸 `isPublic` 키는 Jackson 입장에서 "모르는 필드"라 `FAIL_ON_UNKNOWN_PROPERTIES`가 꺼져있는 기본 설정상 조용히 무시되고, 원시 `boolean`의 기본값인 `false`가 그대로 남음

**해결**
- 필드에 `@JsonProperty("isPublic")`를 명시해 직렬화/역직렬화 시 사용할 JSON 키 이름을 강제로 고정

**배운 점**
- 같은 현상(getter 이름 변형)이 응답을 만들 때는 "그냥 그렇게 나가는 것"으로 끝나지만, 요청을 받을 때는 값이 조용히 버려지는 실제 버그로 이어질 수 있음 — 직렬화와 역직렬화를 같이 검증해야 함
- "분명히 값을 보냈는데 반영이 안 된다"는 증상은 예외가 던져진 게 아니라 조용히 무시됐을 가능성부터 의심하는 습관이 필요함

### Spring Security 경로 매칭 — 정확한 경로와 와일드카드의 차이
**상황**
- `GET /api/posts`(목록)는 비로그인으로 정상 호출되는데, `GET /api/posts/{id}`(상세조회)는 토큰 없이 호출하면 401이 발생

**원인**
- `requestMatchers(HttpMethod.GET, "/api/posts")`는 정확히 그 경로 하나만 매치하고 하위 경로(`/api/posts/5`)는 매치하지 않아, 결국 `anyRequest().authenticated()`에 걸려버림

**해결**
- `/api/posts/*` 패턴을 별도로 추가 등록해 한 단계 하위 경로까지 비로그인 접근을 허용

**배운 점**
- 인증 예외 처리는 "경로 접두사"가 아니라 정확한 패턴 매칭 기준으로 동작함 — 목록/상세처럼 경로 깊이가 다른 엔드포인트는 각각 별도로 명시해야 함

### 전역 예외 처리에서 HTTP 상태 코드가 실제로 반영되지 않던 문제
**상황**
- `ErrorCode`에 404/403 등 상태 코드를 정의해뒀지만, 실제로는 모든 `CustomException`이 200 OK로 응답되고 있었음 (Member 도메인 포함 전역적으로 발생 중이던 문제)

**원인**
- `GlobalExceptionHandler`의 `@ExceptionHandler`가 `ResponseEntity`로 감싸지 않고 `ApiResponse`를 그대로 반환 — Spring이 별도 지정이 없으면 기본값인 200으로 응답을 내려보냄

**해결**
- `CustomException`에 `errorCode`를 꺼낼 수 있는 getter를 추가하고, `GlobalExceptionHandler`가 `ResponseEntity.status(errorCode.getStatus())`로 실제 HTTP 상태 코드를 설정하도록 수정

**배운 점**
- "에러 메시지가 응답 바디에 담기는 것"과 "HTTP 상태 코드가 올바르게 설정되는 것"은 별개의 문제 — 프론트가 상태 코드 기준으로 에러를 분기 처리한다면, 이 차이를 놓치는 순간 모든 에러가 성공으로 오인될 수 있음

---

### JPA Repository 메서드 이름 규칙 혼동 — `Count` 대문자, `Pageable` 위치
**상황**
- `PostLikeRepository`에 `CountByPostAndType`을 작성했는데 Spring이 해당 메서드를 인식하지 못함
- `findByPostAndPage(Post post, Pageable pageable)` 작성 시 "page 필드를 찾을 수 없다"는 에러 발생

**원인**
- JPA 메서드 이름 파싱 규칙: 접두사 `findBy` / `countBy`는 소문자 c로 시작해야 인식됨. 대문자 `Count`는 규약 밖이라 무시됨
- `Pageable`은 SQL WHERE 조건이 아닌 페이징 파라미터로, 메서드 이름에 포함시키면 JPA가 "page라는 필드를 조건으로 찾으려 한다"고 해석

**해결**
```java
// ❌
CountByPostAndType(Post post, PostLike.LikeType type)
findByPostAndPage(Post post, Pageable pageable)

// ✅
countByPostAndType(Post post, PostLike.LikeType type)
findByPost(Post post, Pageable pageable)   // Pageable은 이름 밖에
```

**배운 점**
- JPA 메서드 이름은 대소문자 포함 정해진 규약이 있음 — `find`, `count`, `delete`, `exists` 등 소문자로 시작
- `Pageable`은 "몇 개씩 몇 페이지" 지시서일 뿐, WHERE 조건이 아님

---

### DTO에 JPA 엔티티를 직접 참조 → 순환참조로 서버 장애
**상황**
- `CommentResponse`에 `Member member` 필드를 그대로 넣었더니 응답 직렬화 시 스택 오버플로우 발생

**원인**
- `Comment → Member → List<Post> → List<Comment> → ...` 무한 순환 참조
- Jackson이 JSON으로 직렬화하는 과정에서 객체 그래프를 무한하게 따라가며 스택 초과

**해결**
```java
// ❌ 엔티티 직접 담기
public class CommentResponse {
    private Member member;   // 순환참조 폭탄
}

// ✅ 필요한 값만 뽑아서 기본 타입으로
public class CommentResponse {
    private String nickname;   // comment.getMember().getNickname()으로 꺼냄
}
```

**배운 점**
- DTO는 반드시 String, Long, LocalDateTime 등 기본 타입으로만 구성
- 연관 엔티티에서 값이 필요하면 `entity.getRelation().getField()` 형태로 꺼내서 저장

---

### 댓글 삭제 권한 체크 대상을 잘못 지정
**상황**
- 댓글 삭제 API에서 "작성자만 삭제 가능" 검증 코드를 작성했는데, 실제로는 글 작성자(Post author)를 체크하고 있었음
- 결과적으로 글 작성자가 아닌 사람은 자기가 쓴 댓글도 삭제 불가, 반대로 글 작성자는 다른 사람 댓글도 삭제 가능한 상태

**원인**
```java
// ❌ 글 작성자를 체크
if (!post.getMember().getId().equals(member.getId()))

// ✅ 댓글 작성자를 체크해야 맞음
if (!comment.getMember().getId().equals(member.getId()))
```
- `post`와 `comment`를 혼동하여 권한 체크 대상이 완전히 바뀐 상태

**배운 점**
- 권한 체크는 항상 "이 리소스(comment)를 누가 만들었나"를 기준으로. "이 리소스가 속한 부모(post)를 누가 만들었나"가 아님
- 권한 체크 로직은 단위 테스트로 반드시 검증해야 하는 항목

---

### Enum 값을 String 리터럴로 비교하는 실수
**상황**
- PostLike 토글 로직에서 `if (postLike.getType() == "LIKE")` 로 비교했는데 조건이 항상 false

**원인**
- `PostLike.LikeType`은 Java Enum 타입. `"LIKE"`는 String 리터럴
- Enum과 String을 `==`로 비교하면 타입 자체가 달라 항상 false 반환

**해결**
```java
// ❌
if (postLike.getType() == "LIKE")

// ✅
if (postLike.getType() == PostLike.LikeType.LIKE)
```

**배운 점**
- Java Enum은 싱글턴 인스턴스라 `==`로 비교하는 게 맞지만, 반드시 같은 Enum 타입끼리만 비교
- String과 섞이는 순간 의미 없는 비교가 됨 — IDE에서 경고를 띄워주므로 그냥 지나치지 말 것

---

*(이후 기능 구현하면서 트러블 슈팅 계속 추가 예정)*

---

## 7. 프로젝트 결과

*(기능 완성 후 채울 항목)*

- API 엔드포인트 총 N개
- Swagger 문서: `http://localhost:8080/swagger-ui/index.html`
- 주요 화면 스크린샷 (추가 예정)
