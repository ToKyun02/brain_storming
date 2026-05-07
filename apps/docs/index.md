---
layout: home

hero:
  name: Brain Storming
  text: AI 협업 브레인스토밍 플랫폼
  tagline: 개발자 팀이 기술 의사결정을 실시간으로 함께 논의하고, AI가 단계별로 정리·추천·반박해주는 협업 도구
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/getting-started
    - theme: alt
      text: 기술 스택 보기
      link: /architecture/tech-stack

features:
  - icon: 🃏
    title: 실시간 브레인스토밍 보드
    details: 포스트잇 카드 추가·삭제, 멤버별 색상 고정, WebSocket 기반 실시간 동기화, 카드 투표 및 득표순 정렬
  - icon: 🤖
    title: AI 단계별 분석
    details: 1단계 정리자(요약·pros/cons) → 2단계 추천자(근거 제시) → 3단계 반박자(검증) 순서로 Claude AI가 스트리밍 응답
  - icon: 📋
    title: 결정 히스토리
    details: 종료된 방의 세션 요약, 상위 카드, AI 응답을 JSON/Markdown으로 S3에 저장·Export
  - icon: 🔗
    title: 초대 링크 방 시스템
    details: 구글 OAuth 로그인, 방 생성 후 초대 링크 발급, 링크 접근 시 자동 입장
---
