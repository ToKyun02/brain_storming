# REST API

Base URL: `http://localhost:4000`  
Swagger UI: `http://localhost:4000/api`

모든 인증이 필요한 요청에는 `Authorization: Bearer <JWT>` 헤더가 필요합니다.

## 인증 (Auth)

### Google OAuth 로그인

| Method | Endpoint | 설명 |
|---|---|---|
| `GET` | `/auth/google` | 구글 OAuth 리다이렉트 |
| `GET` | `/auth/google/callback` | OAuth 콜백 → JWT 발급 |
| `GET` | `/auth/me` | 현재 로그인 유저 정보 |

```http
GET /auth/me
Authorization: Bearer <JWT>

# Response
{
  "id": "uuid",
  "email": "user@gmail.com",
  "name": "홍길동",
  "avatar_url": "https://..."
}
```

## 방 (Rooms)

| Method | Endpoint | 설명 | 권한 |
|---|---|---|---|
| `GET` | `/rooms` | 내 방 목록 | 로그인 |
| `POST` | `/rooms` | 방 생성 | 로그인 |
| `GET` | `/rooms/:id` | 방 상세 + 카드 전체 | 멤버 |
| `PATCH` | `/rooms/:id/status` | 방 상태 변경 (종료) | 방장 |
| `GET` | `/rooms/join/:token` | 초대 링크로 입장 | 로그인 |

### 방 생성

```http
POST /rooms
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "title": "DB 기술 선택",
  "topic": "PostgreSQL vs MongoDB 어떤 게 맞을까요?"
}

# Response 201
{
  "id": "uuid",
  "title": "DB 기술 선택",
  "topic": "PostgreSQL vs MongoDB 어떤 게 맞을까요?",
  "status": "active",
  "invite_token": "abc123",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 방 종료

```http
PATCH /rooms/:id/status
Authorization: Bearer <JWT>

{ "status": "closed" }
```

## 카드 (Cards)

| Method | Endpoint | 설명 | 권한 |
|---|---|---|---|
| `POST` | `/rooms/:id/cards` | 카드 추가 | 멤버 |
| `DELETE` | `/cards/:id` | 카드 삭제 | 작성자 |
| `POST` | `/cards/:id/vote` | 투표 토글 (추가/취소) | 멤버 |

### 카드 추가

```http
POST /rooms/:id/cards
Authorization: Bearer <JWT>

{ "content": "PostgreSQL이 트랜잭션 지원이 강력해서 좋을 것 같아요." }

# Response 201
{
  "id": "uuid",
  "content": "PostgreSQL이 트랜잭션 지원이 강력해서 좋을 것 같아요.",
  "vote_count": 0,
  "user": { "id": "uuid", "name": "홍길동", "color": "#FF6B6B" }
}
```

## AI (AI 분석)

| Method | Endpoint | 설명 | 권한 |
|---|---|---|---|
| `POST` | `/rooms/:id/ai/analyze` | AI 분석 요청 (비동기) | 방장 |
| `PATCH` | `/rooms/:id/ai/stage` | AI 단계 변경 | 방장 |
| `GET` | `/rooms/:id/ai/history` | AI 응답 목록 | 멤버 |

### AI 분석 요청

```http
POST /rooms/:id/ai/analyze
Authorization: Bearer <JWT>

{ "stage": "summarize" }

# Response 202 (비동기 처리 시작)
{ "message": "AI 분석이 시작되었습니다." }
```

실제 AI 응답은 **WebSocket `ai.stream` 이벤트**로 스트리밍됩니다.

### AI 단계 변경

```http
PATCH /rooms/:id/ai/stage
Authorization: Bearer <JWT>

{ "stage": "recommend" }
```

> `stage` 값: `summarize` | `recommend` | `challenge`

## 결정 히스토리 (Decisions)

| Method | Endpoint | 설명 | 권한 |
|---|---|---|---|
| `POST` | `/rooms/:id/decision` | 최종 결정 저장 + S3 업로드 | 방장 |
| `GET` | `/decisions` | 내 히스토리 전체 목록 | 로그인 |

### 최종 결정 저장

```http
POST /rooms/:id/decision
Authorization: Bearer <JWT>

{ "content": "PostgreSQL을 사용하기로 결정했습니다." }

# Response 201
{
  "id": "uuid",
  "content": "PostgreSQL을 사용하기로 결정했습니다.",
  "s3_url": "https://s3.amazonaws.com/brainstorm-sessions/..."
}
```

## 에러 응답 형식

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "JWT token is invalid or expired"
}
```

| 상태코드 | 의미 |
|---|---|
| `400` | Bad Request — 유효하지 않은 요청 본문 |
| `401` | Unauthorized — JWT 없음/만료 |
| `403` | Forbidden — 권한 없음 (방장 전용 등) |
| `404` | Not Found — 리소스 없음 |
| `409` | Conflict — 중복 (이미 투표함 등) |
