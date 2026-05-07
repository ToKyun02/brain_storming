# 8주 개발 일정

## 전체 로드맵

```
1주  ████░░░░░░░░░░░░  프로젝트 세팅 + Google OAuth
2주  ████░░░░░░░░░░░░  Room API + 대시보드
3주  ████░░░░░░░░░░░░  WebSocket 실시간 연결
4주  ████░░░░░░░░░░░░  메인 보드 UI 완성
5주  ████░░░░░░░░░░░░  AI 연동 (Claude API + Celery)
6주  ████░░░░░░░░░░░░  히스토리 + S3 + EC2 배포
7주  ████░░░░░░░░░░░░  Redis 캐싱 + Sentry
8주  ████░░░░░░░░░░░░  완성도 + 포트폴리오 정리
```

## 주차별 상세

### 1주차 — 프로젝트 세팅 + Google OAuth

**마일스톤:** 로그인 → JWT 발급 완성

| 작업 | 설명 |
|---|---|
| 모노레포 세팅 | pnpm workspaces + Turborepo 구성 |
| Docker Compose | PostgreSQL + Redis 로컬 환경 구성 |
| Google OAuth | NestJS Passport Google Strategy |
| JWT 발급 | 로그인 성공 → JWT 응답 |
| User 테이블 | DB 마이그레이션 |
| Next.js 로그인 페이지 | `/login` 화면 + OAuth 리다이렉트 |

---

### 2주차 — Room API + 대시보드

**마일스톤:** 방 생성 + 초대 링크 작동

| 작업 | 설명 |
|---|---|
| Room / RoomMember 테이블 | DB 마이그레이션 |
| Room REST API | `POST /rooms`, `GET /rooms`, `GET /rooms/join/:token` |
| 초대 링크 발급 | UUID 토큰 생성 + 클립보드 복사 |
| 대시보드 UI | 방 목록 + 방 생성 모달 |
| 인증 Guard | JWT 인증 미들웨어 전체 적용 |

---

### 3주차 — WebSocket 실시간 연결

**마일스톤:** 두 브라우저에서 카드 동기화 확인

| 작업 | 설명 |
|---|---|
| Card / Vote 테이블 | DB 마이그레이션 |
| NestJS WebSocket Gateway | Socket.io 게이트웨이 구성 |
| Redis Adapter | 다중 인스턴스 Pub/Sub 연결 |
| card.add / card.delete 이벤트 | 실시간 브로드캐스트 |
| Socket.io-client 연결 | Next.js에서 연결 + 이벤트 수신 |
| 투표 API + vote.update 이벤트 | 투표 토글 + 실시간 반영 |

---

### 4주차 — 메인 보드 UI 완성

**마일스톤:** 실시간 협업 보드 완성

| 작업 | 설명 |
|---|---|
| 브레인스토밍 보드 레이아웃 | 좌측 보드 + 우측 AI 패널 분할 |
| 포스트잇 카드 컴포넌트 | 멤버별 색상, 내용, 득표 수 |
| 투표 UI | 득표순 정렬 + 애니메이션 |
| 멤버 아바타 | 현재 접속 멤버 실시간 표시 |
| 방 종료 기능 | 방장 전용 `PATCH /rooms/:id/status` |

---

### 5주차 — AI 연동 (Claude API + Celery)

**마일스톤:** AI 실시간 분석 응답

| 작업 | 설명 |
|---|---|
| AISession 테이블 | DB 마이그레이션 |
| Celery 태스크 구성 | AI 분석 비동기 처리 |
| Claude API 연동 | 단계별 프롬프트 설계 |
| ai.stream WebSocket 이벤트 | 토큰 단위 스트리밍 |
| AI 패널 UI | 단계 뱃지 + 타이핑 효과 |
| AI 단계 전환 | 방장 수동 단계 변경 |

---

### 6주차 — 히스토리 + S3 + EC2 배포

**마일스톤:** 실제 URL로 접속 가능

| 작업 | 설명 |
|---|---|
| Decision 테이블 | DB 마이그레이션 |
| S3 업로드 | 세션 JSON/Markdown export |
| 히스토리 페이지 UI | `/decisions`, `/decisions/[id]` |
| Dockerfile 작성 | web, api 각 Dockerfile |
| EC2 세팅 | Docker 설치, Nginx 설정, SSL(Let's Encrypt) |
| GitHub Actions 배포 | main push → EC2 자동 배포 |

---

### 7주차 — Redis 캐싱 + Sentry

**마일스톤:** 안정적 운영 상태

| 작업 | 설명 |
|---|---|
| Redis 캐싱 | 방 상세, 카드 목록 캐싱 전략 |
| Sentry 연동 | NestJS + Next.js 에러 트래킹 |
| 부하 테스트 | k6로 WebSocket 동시 연결 테스트 |
| 에러 핸들링 | 전역 예외 필터, 재연결 로직 |

---

### 8주차 — 완성도 + 포트폴리오 정리

**마일스톤:** 면접용 포트폴리오 완성

| 작업 | 설명 |
|---|---|
| UI/UX 마무리 | 로딩 상태, 에러 처리, 빈 상태 화면 |
| README 작성 | 기술 스택, 실행 방법, 아키텍처 다이어그램 |
| 이 문서 사이트 | VitePress 배포 (GitHub Pages 또는 EC2) |
| 데모 영상 | 핵심 기능 시연 녹화 |
| 포트폴리오 작성 | 기술적 도전, 트러블슈팅 경험 정리 |

## 기간 요약

| 기간 | 목표 |
|---|---|
| **1~2주** | DB 설계 + 인증 + 기본 API |
| **3~5주** | 실시간 보드 + AI 연동 |
| **6~8주** | 배포 + 안정화 + 마무리 |
