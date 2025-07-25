# 🍌 BANANA-SUNO 연동 시스템 PRD

## 🧠 프로젝트명
**Pinocchio AI x Suno 자동 창작 연동 시스템**

---

## 🔥 목표 (Goal)

형의 자연어 감정/상황 묘사를 기반으로  
**Suno에서 자동 음악을 생성**하고,  
결과물을 Google Drive, Logic Pro, Raycast 등과 연동하여  
**완전 자동 창작 루프**를 실현한다.

---

## 🎯 핵심 기능

- 자연어 감정 입력 분석
- Pinocchio AI 프롬프트 생성
- Suno API 호출 및 결과 polling
- MP3 자동 다운로드 및 정리
- 알림 및 저장소 자동 연동

---

## 🛠️ 시스템 구성도

```
[형의 말]
↓
감정 분석 API (Symanto/NLPCloud)
↓
Pinocchio AI (감정 해석 + 스타일 태깅)
↓
프롬프트 생성
↓
Suno API 호출 (gcui-art/suno-api 또는 PiAPI)
↓
mp3 결과 저장 + Google Drive 업로드 + Raycast 노트 등록
```

---

## ⚙️ 기술 구성 (2025년 7월 업데이트)

| 구성 요소 | 사용 기술 | 실현 가능성 | 비용 |
|-----------|------------|-------------|------|
| 프롬프트 엔진 | Pinocchio AI | 95% | 무료 |
| 자동화 플랫폼 | n8n | 90% | 무료 |
| Suno 연결 | gcui-art/suno-api 또는 PiAPI | 90% | $0.02-0.144/generation |
| 감정 분석 | Symanto/NLPCloud | 95% | 월 $50 이내 |
| 저장소 | Google Drive API | 98% | 무료 |
| 알림 | Raycast API | 85% | 무료 |
| CAPTCHA 해결 | 2Captcha | 90% | 월 $20-50 |

---

## 📊 실현 가능성 분석

### 전체 프로젝트 실현 가능성: **85%**

#### 컴포넌트별 분석
- **Suno API 연동**: 90% (gcui-art/suno-api 활발한 개발, CAPTCHA 해결 비용 위험)
- **감정 분석 API**: 95% (Symanto/NLPCloud 안정적, 예산 내 가능)
- **Google Drive 연동**: 98% (공식 API, TypeScript 지원)
- **Raycast 알림**: 85% (macOS 전용, Extension 개발 필요)
- **n8n 자동화**: 90% (기존 템플릿 존재)

### 🚨 주요 위험 요소
1. **Suno 공식 API 출시 시 비공식 API 불안정성**
2. **CAPTCHA 해결 비용 증가 가능성** (현재 월 $20-50)
3. **감정 분석 정확도가 90% 미달 시 재작업 필요**
4. **macOS 전용 제약** (Raycast)
5. **API 키 관리 및 보안 이슈**

---

## 📤 입력 예시 → 출력

```json
입력:
"피노키오, 드레이크 스타일의 새벽 감성 노래 만들어줘"

출력:
{
  "prompt": "A mid-tempo emotional R&B track in the style of Drake",
  "tags": ["rnb", "emotional", "drake", "3am"],
  "bpm": 75,
  "emotion": "melancholy",
  "confidence": 0.92
}
```

---

## ✅ 성공 조건

- 형의 자연어 발화 → 30초 이내 Suno 곡 생성 완료
- 감정/스타일 90% 이상 정확 반영
- mp3 자동 업로드 및 링크 제공
- 완전 자동화된 워크플로우

---

## 🗓️ 개발 계획 (4주 타임라인)

### Week 1: API 선택 및 기본 환경 구축
- [ ] Suno API 선택 (gcui-art/suno-api vs PiAPI)
- [ ] 감정 분석 API 비교 테스트 (Symanto vs NLPCloud)
- [ ] Node.js + TypeScript 프로젝트 초기화
- [ ] 2Captcha 계정 설정 및 비용 계산

### Week 2: 핵심 API 연동 및 테스트
- [ ] Suno API 클라이언트 구현
- [ ] 감정 분석 API 연동
- [ ] 프롬프트 생성 엔진 개발
- [ ] 기본 테스트 환경 구축

### Week 3: 자동화 시스템 구축
- [ ] n8n 워크플로우 구현 (템플릿 #3814 기반)
- [ ] Google Drive 자동 업로드
- [ ] Raycast 알림 연동
- [ ] 에러 처리 및 재시도 로직

### Week 4: 최적화 및 배포
- [ ] 성능 최적화
- [ ] 통합 테스트
- [ ] 문서화
- [ ] 배포 준비

---

## 🧩 향후 확장

- 🎤 보이스 트리거 연동
- 🎛️ FSD 모드 자동 진입
- 🖼️ 커버 이미지 + 영상 생성 자동화 (Runway, MJ)
- 🌐 웹 인터페이스 개발
- 📱 모바일 앱 연동

---

## 💰 예산 계획

| 항목 | 월 비용 | 연 비용 | 비고 |
|------|---------|---------|------|
| Suno API | $50-200 | $600-2400 | 사용량에 따라 변동 |
| 감정 분석 API | $50 | $600 | Symanto/NLPCloud |
| 2Captcha | $20-50 | $240-600 | CAPTCHA 해결 |
| Google Drive | 무료 | 무료 | 15GB 무료 티어 |
| **총계** | **$120-300** | **$1440-3600** | **연간 예상** |

---

## 🔧 기술 스택

### 백엔드
- **언어**: TypeScript
- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **검증**: Zod
- **테스트**: Jest

### API 연동
- **Suno**: gcui-art/suno-api 또는 PiAPI
- **감정 분석**: Symanto API 또는 NLPCloud
- **Google Drive**: googleapis
- **Raycast**: Raycast Extension API

### 자동화
- **워크플로우**: n8n
- **CAPTCHA 해결**: 2Captcha
- **HTTP 클라이언트**: axios

---

## 📋 즉시 필요한 작업

1. **Suno API 선택 결정**
   - gcui-art/suno-api vs PiAPI 비교 분석
   - 2Captcha 비용 계산 및 계정 설정

2. **감정 분석 API 테스트**
   - Symanto vs NLPCloud 성능 비교
   - 한국어 지원 확인

3. **개발 환경 구축**
   - Node.js + TypeScript 프로젝트 초기화
   - 기본 의존성 설치

---

## 📝 참고 자료

- [gcui-art/suno-api](https://github.com/gcui-art/suno-api) - 비공식 Suno API
- [n8n 워크플로우 #3814](https://n8n.io/workflows/3814-generate-ai-songs-music-videos-using-suno-api-flux-runway-and-creatomate/) - AI 음악 생성 자동화
- [Symanto Emotion API](https://www.symanto.com/nlp-tools/nlp-api/emotion-text-analysis/) - 감정 분석
- [Google Drive API](https://developers.google.com/drive/api/quickstart/nodejs) - 파일 업로드
- [Raycast API](https://developers.raycast.com/) - 알림 시스템

---

*마지막 업데이트: 2025년 7월 24일*
*실현 가능성: 85%*