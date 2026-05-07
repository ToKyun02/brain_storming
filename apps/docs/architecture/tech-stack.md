# 기술 스택

## 전체 구성도

```
┌─────────────────────────────────────────────────────────┐
│                       Frontend                          │
│  Next.js 15 (App Router) · TypeScript · Tailwind CSS   │
│  Zustand (상태관리) · Socket.io-client                  │
└────────────────────┬────────────────────────────────────┘
                     │ REST / WebSocket
┌────────────────────▼────────────────────────────────────┐
│                       Backend                           │
│  NestJS · PostgreSQL · Redis                           │
│  Celery (AI 비동기) · Claude API · Google OAuth        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                       Infra                             │
│  Docker + Docker Compose · GitHub Actions CI/CD        │
│  AWS EC2 + Nginx · S3 · Sentry                        │
└─────────────────────────────────────────────────────────┘
```

## Frontend

| 기술 | 버전 | 역할 |
|---|---|---|
| **Next.js** | 15 (App Router) | 메인 프레임워크, SSR/CSR 혼합 |
| **TypeScript** | 5.x | 정적 타입 안전성 |
| **Tailwind CSS** | 3.x | 유틸리티 기반 스타일링 |
| **Zustand** | 4.x | 전역 상태 관리 (보드, 멤버 등) |
| **Socket.io-client** | 4.x | WebSocket 실시간 연결 |

### Next.js App Router 구조

```
apps/web/app/
├── (auth)/
│   └── login/          # 구글 OAuth 로그인
├── (dashboard)/
│   └── rooms/          # 방 목록 대시보드
├── rooms/
│   └── [id]/           # 브레인스토밍 보드 (메인)
├── decisions/          # 결정 히스토리
└── layout.tsx
```

## Backend

| 기술 | 버전 | 역할 |
|---|---|---|
| **NestJS** | 11.x | 메인 백엔드 프레임워크 (REST + WebSocket) |
| **PostgreSQL** | 15+ | 메인 데이터베이스 |
| **Redis** | 7.x | 캐싱 + WebSocket Pub/Sub |
| **Celery** | - | Claude API 비동기 태스크 처리 |
| **Claude API** | - | AI 분석 (정리자/추천자/반박자) |
| **Google OAuth 2.0** | - | 소셜 로그인 + JWT 발급 |

### NestJS 모듈 구조

```
apps/api/src/
├── auth/               # Google OAuth + JWT
├── rooms/              # 방 생성/관리 REST API
├── cards/              # 카드 CRUD + 투표
├── gateway/            # WebSocket Gateway (Socket.io)
├── ai/                 # Claude API 연동 + Celery 태스크
├── decisions/          # 히스토리 + S3 저장
└── shared/             # 공통 DTO, Guard, Decorator
```

### WebSocket Gateway

NestJS의 `@WebSocketGateway`로 Socket.io 서버를 구성합니다.  
Redis Adapter를 연결해 **다중 서버 환경에서도 Pub/Sub 동기화**가 가능합니다.

```
Client ──── Socket.io ──── NestJS Gateway ──── Redis Pub/Sub ──── 다른 서버 인스턴스
```

## Infra

| 기술 | 역할 |
|---|---|
| **Docker + Docker Compose** | 모든 서비스 컨테이너화, 로컬 개발 환경 통일 |
| **GitHub Actions** | CI/CD — PR 시 lint/test, main 브랜치 push 시 자동 배포 |
| **AWS EC2** | 서버 호스팅 |
| **Nginx** | 리버스 프록시, SSL 종료, WebSocket 업그레이드 처리 |
| **AWS S3** | 세션 결과물 JSON/Markdown 저장 및 Export URL 제공 |
| **Sentry** | 프론트/백 에러 모니터링 및 알림 |

## 모노레포 공유 패키지

| 패키지 | 역할 |
|---|---|
| `@repo/api` | 프론트/백 공통 DTO, 타입, enum |
| `@repo/ui` | 공통 React 컴포넌트 |
| `@repo/eslint-config` | 공통 ESLint 설정 |
| `@repo/typescript-config` | 공통 tsconfig |
| `@repo/jest-config` | 공통 Jest 설정 |
