# WebSocket 이벤트

Socket.io 기반 실시간 통신입니다.  
NestJS `@WebSocketGateway` + Redis Adapter로 구성됩니다.

## 연결

```ts
// apps/web — Socket.io 클라이언트 연결 예시
import { io } from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  auth: { token: jwtToken },
  query: { roomId },
})
```

연결 시 서버는 JWT를 검증하고, 해당 `roomId`의 소켓 룸에 자동 join합니다.

## 이벤트 목록

### 카드 관련

| 이벤트 | 방향 | 설명 |
|---|---|---|
| `card.add` | Server → Client | 카드 추가 브로드캐스트 |
| `card.delete` | Server → Client | 카드 삭제 브로드캐스트 |
| `vote.update` | Server → Client | 투표 수 실시간 반영 |

#### `card.add`

```ts
// 수신 데이터
socket.on('card.add', (data: {
  id: string
  content: string
  vote_count: number
  user: {
    id: string
    name: string
    color: string
    avatar_url: string
  }
  created_at: string
}) => {
  // 보드에 카드 추가
})
```

#### `card.delete`

```ts
socket.on('card.delete', (data: {
  cardId: string
}) => {
  // 보드에서 카드 제거
})
```

#### `vote.update`

```ts
socket.on('vote.update', (data: {
  cardId: string
  vote_count: number
  voted_by: string[]  // 투표한 userId 배열
}) => {
  // 득표 수 업데이트 + 정렬
})
```

### AI 관련

| 이벤트 | 방향 | 설명 |
|---|---|---|
| `ai.stream` | Server → Client | AI 응답 토큰 스트리밍 |
| `ai.done` | Server → Client | AI 응답 완료 |
| `ai.stage` | Server → Client | AI 단계 변경 알림 |

#### `ai.stream`

```ts
// Claude API 응답이 토큰 단위로 실시간 전송됨
socket.on('ai.stream', (data: {
  token: string       // 응답 토큰 조각
  sessionId: string
  stage: 'summarize' | 'recommend' | 'challenge'
}) => {
  // 패널에 타이핑 효과로 append
})
```

#### `ai.done`

```ts
socket.on('ai.done', (data: {
  sessionId: string
  stage: 'summarize' | 'recommend' | 'challenge'
  full_response: string  // 전체 응답 텍스트
}) => {
  // 스트리밍 완료 처리
})
```

#### `ai.stage`

```ts
// 방장이 AI 단계 변경 시 전체 멤버에게 전송
socket.on('ai.stage', (data: {
  stage: 'summarize' | 'recommend' | 'challenge'
}) => {
  // AI 패널 단계 뱃지 업데이트
})
```

### 멤버 관련

| 이벤트 | 방향 | 설명 |
|---|---|---|
| `member.join` | Server → Client | 멤버 입장 알림 |
| `member.leave` | Server → Client | 멤버 퇴장 알림 |

#### `member.join`

```ts
socket.on('member.join', (data: {
  user: {
    id: string
    name: string
    avatar_url: string
    color: string
  }
  online_count: number
}) => {
  // 아바타 목록에 추가
})
```

#### `member.leave`

```ts
socket.on('member.leave', (data: {
  userId: string
  online_count: number
}) => {
  // 아바타 목록에서 제거
})
```

### 방 관련

| 이벤트 | 방향 | 설명 |
|---|---|---|
| `room.close` | Server → Client | 방 종료 알림 |

#### `room.close`

```ts
// 방장이 방을 종료하면 전체 멤버에게 전송
socket.on('room.close', () => {
  // 결정 히스토리 페이지로 리다이렉트
})
```

## Redis Adapter 구성

```ts
// apps/api/src/main.ts
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()

io.adapter(createAdapter(pubClient, subClient))
```

Redis Adapter를 사용하면 **EC2 인스턴스가 여러 개여도** 소켓 이벤트가 모든 서버에 동기화됩니다.
