import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Brain Storming',
  description: '개발자 팀 AI 협업 브레인스토밍 플랫폼 개발 가이드',
  lang: 'ko-KR',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: '시작하기', link: '/guide/getting-started' },
      { text: '아키텍처', link: '/architecture/tech-stack' },
      { text: 'API', link: '/api/rest' },
      { text: '인프라', link: '/infra/docker' },
      { text: '일정', link: '/schedule' },
    ],
    sidebar: [
      {
        text: '가이드',
        items: [
          { text: '프로젝트 소개', link: '/' },
          { text: '시작하기', link: '/guide/getting-started' },
        ],
      },
      {
        text: '아키텍처',
        items: [
          { text: '기술 스택', link: '/architecture/tech-stack' },
          { text: 'DB 스키마', link: '/architecture/db-schema' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'REST API', link: '/api/rest' },
          { text: 'WebSocket 이벤트', link: '/api/websocket' },
        ],
      },
      {
        text: '핵심 기능',
        items: [{ text: '4개 핵심 화면', link: '/features/screens' }],
      },
      {
        text: '인프라',
        items: [{ text: 'Docker', link: '/infra/docker' }],
      },
      { text: '개발 일정', link: '/schedule' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],
    footer: {
      message: 'Brain Storming Platform',
    },
  },
})
