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
Pinocchio AI (감정 해석 + 스타일 태깅)
↓
프롬프트 생성
↓
Suno API 호출
↓
mp3 결과 저장 + Google Drive 업로드 + Raycast 노트 등록
```

---

## ⚙️ 기술 구성

| 구성 요소 | 사용 기술 |
|-----------|------------|
| 프롬프트 엔진 | Pinocchio AI |
| 자동화 플랫폼 | n8n or Claude |
| Suno 연결 | 비공식 API |
| 저장소 | Google Drive API |
| 알림 | Raycast, Telegram, Discord 등 |

---

## 📤 입력 예시 → 출력

```json
입력:
"피노키오, 드레이크 스타일의 새벽 감성 노래 만들어줘"

출력:
{
  "prompt": "A mid-tempo emotional R&B track in the style of Drake",
  "tags": ["rnb", "emotional", "drake", "3am"],
  "bpm": 75
}
```

---

## ✅ 성공 조건

- 형의 자연어 발화 → 30초 이내 Suno 곡 생성 완료
- 감정/스타일 90% 이상 정확 반영
- mp3 자동 업로드 및 링크 제공

---

## 🧩 향후 확장

- 🎤 보이스 트리거 연동
- 🎛️ FSD 모드 자동 진입
- 🖼️ 커버 이미지 + 영상 생성 자동화 (Runway, MJ)