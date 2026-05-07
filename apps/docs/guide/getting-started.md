# 시작하기

## 사전 요구사항

| 도구 | 버전 | 용도 |
|---|---|---|
| Node.js | >= 18 | 런타임 |
| pnpm | 8.15.5 | 패키지 매니저 |
| Docker | latest | 로컬 인프라 실행 |
| Docker Compose | v2+ | 멀티 컨테이너 관리 |

## 레포 클론 및 의존성 설치

```bash
git clone <repository-url>
cd brain_storming

# 의존성 설치 (모든 워크스페이스)
pnpm install
```

## 환경변수 설정

루트와 각 앱에 `.env` 파일을 생성합니다.

**`apps/api/.env`**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/brainstorm

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=brainstorm-sessions

# Claude API
CLAUDE_API_KEY=your-claude-api-key

# Sentry (선택)
SENTRY_DSN=your-sentry-dsn
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

## 로컬 개발 서버 실행

### 방법 1: Docker로 인프라만 띄우고 앱은 직접 실행 (권장)

```bash
# PostgreSQL + Redis 컨테이너 실행
docker compose up -d db redis

# 전체 앱 개발 서버 실행
pnpm dev
```

### 방법 2: Docker Compose로 전체 실행

```bash
docker compose up
```

## 실행 확인

| 서비스 | URL |
|---|---|
| Web (Next.js) | http://localhost:3001 |
| API (NestJS) | http://localhost:4000 |
| Docs (VitePress) | http://localhost:5173 |
| Swagger | http://localhost:4000/api |

## 특정 앱만 실행

```bash
turbo dev --filter=web     # 프론트엔드만
turbo dev --filter=api     # 백엔드만
turbo dev --filter=docs    # 문서만
```

## 빌드

```bash
# 전체 빌드
pnpm build

# 특정 앱만
turbo build --filter=web
turbo build --filter=api
```
