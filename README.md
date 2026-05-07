# Brain Storming 모노레포

커뮤니티에서 관리하는 예제입니다. 문제가 발생하면 PR로 수정 사항을 제출해 주세요. GitHub Issues는 닫힙니다.

## 시작하기

아래 명령어로 프로젝트를 생성합니다:

```bash
npx create-turbo@latest -e with-nestjs
```

## 프로젝트 구조

```shell
.
├── apps
│   ├── api                       # NestJS 앱 (https://nestjs.com) — REST API + WebSocket
│   ├── web                       # Next.js 앱 (https://nextjs.org)
│   └── docs                      # VitePress 정적 문서
└── packages
    ├── @repo/api                 # NestJS 공유 리소스 (DTO, 타입 등)
    ├── @repo/eslint-config       # 공통 ESLint 설정 (prettier 포함)
    ├── @repo/jest-config         # 공통 Jest 설정
    ├── @repo/typescript-config   # 모노레포 전체에서 사용하는 tsconfig.json
    └── @repo/ui                  # 공통 React 컴포넌트 라이브러리
```

모든 패키지와 앱은 [TypeScript](https://www.typescriptlang.org/)로 작성되어 있습니다.

### 공통 도구

- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 안전성
- [ESLint](https://eslint.org/) - 코드 린팅
- [Prettier](https://prettier.io) - 코드 포맷팅
- [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/) - 테스트

---

## 주요 명령어

모든 앱과 패키지에 대해 사전 구성된 명령어입니다.

### 빌드

```bash
# 모든 앱과 패키지를 빌드합니다.
pnpm run build

# ℹ️ 앱을 개별적으로만 빌드할 경우,
# 반드시 패키지를 먼저 빌드해야 합니다.
```

### 개발 서버 실행

```bash
# 모든 앱과 패키지의 개발 서버를 실행합니다.
pnpm run dev
```

### 테스트

```bash
# 모든 앱과 패키지의 테스트를 실행합니다.
pnpm run test

# E2E 테스트 실행
pnpm run test:e2e

# 동작 커스터마이징은 `@repo/jest-config`를 참고하세요.
```

### 린트

```bash
# 모든 앱과 패키지를 린트합니다.
# 커스터마이징은 `@repo/eslint-config`를 참고하세요.
pnpm run lint
```

### 포맷

```bash
# 지원되는 모든 .ts, .js, .json, .tsx, .jsx 파일을 포맷합니다.
# 커스터마이징은 `@repo/eslint-config/prettier-base.js`를 참고하세요.
pnpm format
```

---

## Remote Caching (원격 캐싱)

> [!TIP]
> Vercel Remote Cache는 모든 플랜에서 무료입니다. [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache)에서 시작하세요.

Turborepo는 [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)을 통해 빌드 캐시를 팀과 CI/CD 파이프라인 간에 공유할 수 있습니다.

기본적으로 로컬 캐시만 사용하며, Remote Caching 활성화를 위해 Vercel 계정이 필요합니다. 계정이 없다면 [여기서 생성](https://vercel.com/signup?utm_source=turborepo-examples)하고 아래 명령어를 실행하세요:

```bash
npx turbo login
```

Turborepo CLI가 [Vercel 계정](https://vercel.com/docs/concepts/personal-accounts/overview)과 연동됩니다.

이후 아래 명령어로 Remote Cache를 연결합니다:

```bash
npx turbo link
```

---

## 참고 자료

이 예제는 Turbo의 [with-nextjs](https://github.com/vercel/turborepo/tree/main/examples/with-nextjs) 예제와 NestJS의 [01-cats-app](https://github.com/nestjs/nest/tree/master/sample/01-cats-app) 샘플에서 영감을 받았습니다.

Turborepo 더 알아보기:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [Next.js 공식 문서](https://nextjs.org/docs)
