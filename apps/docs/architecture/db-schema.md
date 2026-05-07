# DB 스키마

PostgreSQL 기반의 7개 테이블로 구성됩니다.

## ERD 관계도

```
User ──┬──< Room (creates)
       ├──< RoomMember (joins)
       ├──< Card (writes)
       └──< Vote (casts)

Room ──┬──< RoomMember (has)
       ├──< Card (contains)
       ├──< AISession (generates)
       └──── Decision (results in)

Card ──< Vote (receives)
```

## 테이블 정의

### User

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | 사용자 고유 ID |
| `email` | string | 이메일 (unique) |
| `name` | string | 표시 이름 |
| `avatar_url` | string | 구글 프로필 이미지 |
| `google_id` | string | 구글 OAuth ID |
| `created_at` | timestamp | 생성일 |

### Room

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | 방 고유 ID |
| `created_by` | uuid FK → User | 방장 |
| `title` | string | 방 제목 |
| `topic` | string | 브레인스토밍 주제 |
| `status` | string | `active` / `closed` |
| `invite_token` | string | 초대 링크 토큰 (unique) |
| `created_at` | timestamp | 생성일 |

::: tip status 값
- `active` — 진행 중인 방
- `closed` — 종료된 방 (히스토리로 이동)
:::

### RoomMember

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | |
| `room_id` | uuid FK → Room | |
| `user_id` | uuid FK → User | |
| `color` | string | 멤버 고정 색상 (포스트잇 색상) |
| `joined_at` | timestamp | 입장 시각 |

### Card

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | |
| `room_id` | uuid FK → Room | |
| `user_id` | uuid FK → User | 작성자 |
| `content` | string | 카드 내용 |
| `vote_count` | int | 득표 수 캐시 컬럼 |
| `created_at` | timestamp | |

::: info vote_count
`Vote` 테이블 집계 성능을 위한 캐시 컬럼입니다. 투표 추가/취소 시 함께 업데이트됩니다.
:::

### Vote

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | |
| `card_id` | uuid FK → Card | |
| `user_id` | uuid FK → User | |
| `created_at` | timestamp | |

> 동일 유저가 동일 카드에 중복 투표 방지: `(card_id, user_id)` unique 제약

### AISession

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | |
| `room_id` | uuid FK → Room | |
| `stage` | string | `summarize` / `recommend` / `challenge` |
| `response` | text | AI 응답 전체 텍스트 |
| `created_at` | timestamp | |

::: tip stage 값
| 값 | AI 역할 |
|---|---|
| `summarize` | 정리자 — 의견 요약 + pros/cons |
| `recommend` | 추천자 — 적극 추천 + 근거 |
| `challenge` | 반박자 — "이건 생각해봤어요?" 검증 |
:::

### Decision

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid PK | |
| `room_id` | uuid FK → Room | 1:1 관계 |
| `content` | string | 최종 결정 내용 |
| `s3_url` | string | S3 저장 파일 URL |
| `created_at` | timestamp | |

## 주요 인덱스

```sql
-- 방 목록 조회 (사용자별)
CREATE INDEX idx_room_member_user_id ON room_member(user_id);

-- 카드 득표순 정렬
CREATE INDEX idx_card_vote_count ON card(room_id, vote_count DESC);

-- AI 히스토리 조회
CREATE INDEX idx_ai_session_room_id ON ai_session(room_id, created_at);

-- 초대 토큰 조회
CREATE UNIQUE INDEX idx_room_invite_token ON room(invite_token);
```
