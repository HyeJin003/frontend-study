.'# Haroom 프로젝트 기획서

> **하루 + 룸 = 오늘의 내 공간**
> 현대판 싸이월드 — 나만의 미니홈피에서 일상을 기록하고, 새로운 사람과 연결되는 플랫폼

---

## 기획 배경

아날로그에서 디지털로 급격히 전환되면서 사람들 간의 연결이 줄어들었다.
예전엔 동네 사람들과 밥 나눠 먹고 인사하던 문화가 사라지고, 만나는 사람만 만나는 시대가 됐다.
**Haroom**은 그 온기를 디지털 공간에서 되살리는 서비스다.

---

## 핵심 기능

| 기능 | 설명 |
|------|------|
| 내 공간 (미니홈피) | 나만의 프로필 페이지. 글, 방명록, 타임캡슐 관리 |
| 글 | DC인사이드 스타일 게시판. 일상/일기 자유롭게 작성 |
| 방명록 | 내 홈피에 익명/실명으로 메시지 남기기 |
| 타임캡슐 | 날짜 잠금 글. D-day 되면 자동 공개 |
| 랜덤 연결 | 매일 랜덤 1명과 24시간 연결. 끝나면 사라짐 |
| 친구 | 랜덤 연결된 사람에게 친구 신청 → 영구 연결 |
| 메인 피드 | 전체 유저 최신글 + 오늘의 인기글 + 랜덤 홈피 추천 |

---

## 화면 구조

### 메인 화면
```
상단 메뉴: 로고 | 홈 | 랜덤연결 | 로그인/내공간
──────────────────────────────────────────
[ 실시간 최신글 ]        [ 오늘의 인기글 TOP5  ]
                         [ 랜덤 홈피 추천       ]
```

### 내 공간 (미니홈피)
```
 홈 | 글 | 방명록 | 타임캡슐
 (본인만 추가: 랜덤연결 | 친구)
┌──────────────┬──────────────────────────────────┐
│              │  [애니메이션 배너]                 │
│  프로필사진  ├──────────────────────────────────┤
│  (동그라미)  │                                   │
│              │                                   │
│  닉네임      ├──────────────────────────────────┤
│  친구 N명    │  About Me / 한마디                │
│              ├──────────────────────────────────┤
│              │  💌 방명록 최근 3개               │
└──────────────┴──────────────────────────────────┘
```

### 글 상세 페이지 (DC인사이드 스타일)
```
제목
글쓴이 | 날짜 | 조회수 | 추천수
────────────────────────────
본문 내용 (이미지 포함 가능)
────────────────────────────
👍 추천       👎 비추
────────────────────────────
댓글 목록
  ㄴ 닉네임: 댓글 내용
댓글 입력창
```

---

## DB 설계

### members
```
id              BIGINT PK
email           VARCHAR(100) UNIQUE
password        VARCHAR(255)           (소셜 로그인은 NULL)
nickname        VARCHAR(50) UNIQUE
profile_image   VARCHAR(500)           (이미지 URL, S3 등 스토리지에 저장)
bio             VARCHAR(200)           (한마디 소개글)
role            ENUM('USER', 'ADMIN')
provider        VARCHAR(20)            (local / google / kakao / naver)
created_at      DATETIME
updated_at      DATETIME
```

### posts
```
id            BIGINT PK
member_id     BIGINT FK → members
title         VARCHAR(200)
content       TEXT
is_public     BOOLEAN DEFAULT true
view_count    INT DEFAULT 0           (단순 조회수, 중복 허용)
created_at    DATETIME
updated_at    DATETIME
```
> like_count는 posts에 저장하지 않음 → post_likes 테이블에서 COUNT로 계산

### post_likes
```
id            BIGINT PK
post_id       BIGINT FK → posts
member_id     BIGINT FK → members
type          ENUM('LIKE', 'DISLIKE')
created_at    DATETIME

UNIQUE KEY uq_post_member (post_id, member_id)   ← 1인 1회 제한, 중복 DB 레벨 차단
```

### comments
```
id            BIGINT PK
post_id       BIGINT FK → posts
member_id     BIGINT FK → members
content       VARCHAR(500)
created_at    DATETIME
```

### guestbooks (방명록)
```
id            BIGINT PK
owner_id      BIGINT FK → members    (홈피 주인)
writer_id     BIGINT FK → members    (작성자 — 익명이어도 저장, 화면에만 미표시)
content       VARCHAR(300)
is_anonymous  BOOLEAN DEFAULT false
created_at    DATETIME
```
> writer_id는 익명이어도 실제 값을 저장한다. 어뷰징/신고 대응을 위해 서버는 알고 있어야 함.

### time_capsules
```
id            BIGINT PK
member_id     BIGINT FK → members
title         VARCHAR(200)
content       TEXT
open_at       DATETIME               (공개 예정 날짜)
is_public     BOOLEAN DEFAULT false  (공개 시 전체공개 여부)
is_opened     BOOLEAN DEFAULT false
created_at    DATETIME
```

### random_matches
```
id            BIGINT PK
member_a_id   BIGINT FK → members
member_b_id   BIGINT FK → members
expires_at    DATETIME               (생성 후 24시간)
is_active     BOOLEAN DEFAULT true
created_at    DATETIME

UNIQUE KEY uq_daily_match (member_a_id, member_b_id)   ← 동일 쌍 중복 매칭 방지
```

### friendships
```
id              BIGINT PK
from_member_id  BIGINT FK → members  (신청자)
to_member_id    BIGINT FK → members  (수락자)
status          ENUM('PENDING', 'ACCEPTED', 'REJECTED')
created_at      DATETIME

UNIQUE KEY uq_friendship (from_member_id, to_member_id)   ← 중복 신청 방지
```
> 팔로우 기능 없음. 싸이월드 컨셉에 맞게 친구(1촌) 개념만 유지.

---

## API 설계

### 글 (Post)
```
POST   /api/posts                     글 작성 (로그인 필요)
GET    /api/posts                     전체 글 목록 (메인 피드, 페이징)
GET    /api/posts/popular             오늘의 인기글 TOP5
GET    /api/posts/user/{nickname}     특정 유저 글 목록 (내 공간)
GET    /api/posts/{id}                글 상세 + 조회수 증가
PUT    /api/posts/{id}                글 수정 (작성자만)
DELETE /api/posts/{id}                글 삭제 (작성자만)
POST   /api/posts/{id}/like           추천 (이미 했으면 취소)
POST   /api/posts/{id}/dislike        비추 (이미 했으면 취소)
GET    /api/posts/{id}/like/count     추천수/비추수 조회
```

### 댓글 (Comment)
```
POST   /api/posts/{postId}/comments         댓글 작성
GET    /api/posts/{postId}/comments         댓글 목록
DELETE /api/posts/{postId}/comments/{id}    댓글 삭제 (작성자만)
```

### 방명록 (Guestbook)
```
POST   /api/guestbook/{nickname}      방명록 작성 (익명 여부 선택)
GET    /api/guestbook/{nickname}      방명록 목록
DELETE /api/guestbook/{id}            삭제 (홈피 주인 or 작성자)
```

### 타임캡슐 (TimeCapsule)
```
POST   /api/timecapsule               작성 (날짜 잠금)
GET    /api/timecapsule/my            내 타임캡슐 목록
GET    /api/timecapsule/{id}          상세 (open_at 지난 것만 열람 가능)
```

### 랜덤매칭 (RandomMatch)
```
POST   /api/match/apply               매칭 신청
GET    /api/match/today               오늘의 매칭 상대 조회
DELETE /api/match/cancel              매칭 취소
```

### 친구 (Friendship)
```
POST   /api/friends/request/{nickname}    친구 신청
PUT    /api/friends/accept/{id}           수락
PUT    /api/friends/reject/{id}           거절
GET    /api/friends                       친구 목록
```

---

## 패키지 구조

```
src/main/java/com/hjr/myproject/
├── config/
│   ├── SecurityConfig.java       (기존)
│   └── SwaggerConfig.java        (기존)
├── domain/
│   ├── member/                   (기존 완성)
│   ├── post/
│   │   ├── entity/
│   │   │   ├── Post.java
│   │   │   └── PostLike.java     (post_likes 테이블)
│   │   ├── repository/
│   │   │   ├── PostRepository.java
│   │   │   └── PostLikeRepository.java
│   │   ├── dto/
│   │   │   ├── PostRequestDto.java
│   │   │   └── PostResponseDto.java
│   │   ├── service/PostService.java
│   │   └── controller/PostController.java
│   ├── comment/
│   ├── guestbook/
│   ├── timecapsule/
│   ├── match/
│   └── friendship/
└── global/                       (기존 완성)
    ├── jwt/
    ├── oauth2/
    ├── exception/
    └── common/
```

---

## 구현 로드맵

```
✅ 완성
  - 회원가입 / 로그인 / JWT
  - OAuth2 소셜로그인 (Google, Kakao, Naver)
  - 회원 정보 CRUD
  - Guestbook CRUD (방명록, 익명 처리)
  - Post CRUD (페이징, 조회수, 작성자 권한)
  - PostLike 추천/비추천 토글
  - Comment CRUD (댓글 작성/목록/삭제)

🔄 진행 중
  TimeCapsule CRUD       entity ✅ / repository ✅ / dto 🔄 / service ⬜ / controller ⬜

🚧 진행 예정
  2단계  Scheduler              자동공개 + 매칭 만료 (@Scheduled)
  3단계  RandomMatch            랜덤 추출 + 접근 권한
  4단계  Friendship             상태 관리 (PENDING → ACCEPTED)
  5단계  프론트엔드              React + API 연결
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | Spring Boot 3.5, Java 17 |
| Security | Spring Security 6, JWT, OAuth2 |
| DB | MySQL + Spring Data JPA |
| 문서화 | Swagger (springdoc-openapi) |
| Frontend | React (예정) |
| 배포 | 추후 결정 |
