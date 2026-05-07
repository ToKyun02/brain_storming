# Docker

Docker + Docker Compose로 전체 서비스를 컨테이너화합니다.

## 컨테이너 구성

```
docker compose up
    ├── web       (Next.js)       :3001
    ├── api       (NestJS)        :4000
    ├── db        (PostgreSQL)    :5432
    ├── redis     (Redis)         :6379
    └── worker    (Celery)        AI 비동기 처리
```

## `docker-compose.yml` 구조

```yaml
services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:4000
    depends_on:
      - api

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/brainstorm
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  worker:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.worker
    environment:
      - REDIS_URL=redis://redis:6379
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
    depends_on:
      - redis
    command: celery -A src.celery worker --loglevel=info

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: brainstorm
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 각 앱 Dockerfile

### `apps/api/Dockerfile`

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# 의존성 설치
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# 빌드
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 실행
FROM base AS runner
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main"]
```

### `apps/web/Dockerfile`

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3001
CMD ["node", "server.js"]
```

## 개발 vs 프로덕션

### 개발 환경

```bash
# 인프라만 Docker로 띄우고 앱은 핫리로드로 실행
docker compose up -d db redis

pnpm dev  # turbo dev — 모든 앱 동시 실행
```

### 프로덕션 환경

```bash
# 전체 빌드 후 실행
docker compose -f docker-compose.prod.yml up -d
```

## Nginx 설정 (EC2)

EC2에서 Nginx를 리버스 프록시로 사용합니다.

```nginx
# /etc/nginx/sites-available/brainstorm
server {
    listen 80;
    server_name your-domain.com;

    # Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # NestJS REST API
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

::: warning WebSocket 설정 주의
Nginx에서 WebSocket을 프록시할 때 `Upgrade` 헤더 설정이 반드시 필요합니다.  
빠뜨리면 Socket.io 연결이 polling fallback으로 동작합니다.
:::

## GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: pnpm install
        run: |
          corepack enable
          pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd ~/brain_storming
            git pull
            docker compose -f docker-compose.prod.yml up -d --build
```
