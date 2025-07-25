# 🍌 바나나AI x 슈퍼클로드 MCP 트리거 매뉴얼

## 🚀 시스템 개요

바나나AI가 슈퍼클로드 방식으로 Claude Code의 112개 MCP 도구를 안전하게 실행하는 통합 시스템

## 📋 MCP 도구 카테고리 (112개 도구)

### 🌐 웹 자동화 (24개 도구)
**트리거 키워드:** `웹자동화`, `브라우저제어`, `스크래핑`
```javascript
// 사용 예시
const trigger = "웹자동화로 네이버 검색해줘";
// → playwright-mcp-server 활성화
```

**주요 기능:**
- 브라우저 자동화 및 제어
- 웹 페이지 스크래핑
- 폼 자동 입력 및 제출
- 스크린샷 캡처

### 💻 시스템 관리 (21개 도구)
**트리거 키워드:** `시스템관리`, `파일관리`, `프로세스제어`
```javascript
// 사용 예시  
const trigger = "시스템관리로 프로세스 확인해줘";
// → desktop-commander 활성화
```

**주요 기능:**
- 파일 시스템 조작
- 프로세스 모니터링
- 시스템 명령 실행
- 디렉토리 관리

### ☁️ 클라우드 배포 (21개 도구)
**트리거 키워드:** `클라우드배포`, `서비스관리`, `render`
```javascript
// 사용 예시
const trigger = "클라우드배포로 서비스 올려줘";
// → render 서비스 활성화
```

**주요 기능:**
- Render 서비스 배포
- 환경 변수 관리  
- 로그 모니터링
- 서비스 상태 확인

### 🔍 벡터 데이터베이스 (12개 도구)
**트리거 키워드:** `벡터검색`, `데이터베이스`, `chroma`
```javascript
// 사용 예시
const trigger = "벡터검색으로 유사 문서 찾아줘";
// → chroma 벡터DB 활성화
```

**주요 기능:**
- 벡터 유사도 검색
- 문서 임베딩 생성
- 컬렉션 관리
- 메타데이터 필터링

### 📝 버전 관리 (12개 도구)
**트리거 키워드:** `깃관리`, `버전관리`, `git`
```javascript
// 사용 예시
const trigger = "깃관리로 커밋하고 푸시해줘";
// → git 도구 활성화
```

**주요 기능:**
- Git 커밋 및 푸시
- 브랜치 관리
- 히스토리 조회
- 충돌 해결

## 🛡️ 안전성 프로토콜

### 사전 안전 검사
```javascript
const safetyChecks = {
    containerIsolation: true,    // Docker 컨테이너 격리
    memoryLimit: '2GB',         // 메모리 제한
    cpuLimit: '1 core',         // CPU 제한  
    securityPolicy: 'no-new-privileges',  // 보안 정책
    timeoutLimit: '30s'         // 실행 시간 제한
};
```

### 자동 복구 시스템
- **메모리 모니터링**: 1.5GB 초과시 자동 정리
- **컨테이너 상태 확인**: 10분 간격 헬스체크
- **응급 종료**: 시스템 과부하시 안전 종료

## 🎯 트리거 실행 방법

### 1. 기본 트리거 패턴
```javascript
// 바나나AI 명령 → 슈퍼클로드 → MCP 도구 실행
{
    "query": "웹자동화로 구글에서 AI 뉴스 검색해줘",
    "expectedTool": "playwright-mcp-server",
    "safetyLevel": "high"
}
```

### 2. 복합 트리거 (여러 도구 조합)
```javascript
{
    "query": "깃관리로 코드 커밋하고 클라우드배포로 서비스 올려줘",
    "expectedTools": ["git", "render"],
    "executionMode": "sequential"
}
```

### 3. 조건부 트리거
```javascript
{
    "query": "시스템관리로 메모리 확인하고 부족하면 정리해줘",
    "conditionalExecution": true,
    "fallback": "memory-cleanup"
}
```

## 📊 실행 상태 모니터링

### 실시간 상태 확인
```bash
# MCP 서버 상태
claude mcp list

# Docker 컨테이너 상태  
docker ps --filter label=docker-mcp=true

# 메모리 사용량
docker stats --no-stream
```

### 로그 확인
```bash
# 안전성 로그
tail -f /Users/Jadaking/Library/Logs/mcp-safety.log

# 실행 결과 로그  
tail -f /Users/Jadaking/jadaking-actor/storage/datasets/default/*.json
```

## 🔧 확장 가능성

### 새 도구 추가 방법
```javascript
// banana-ai-mcp-integration.js에서
const newTool = {
    name: 'custom-tool',
    category: 'custom-category', 
    tools: 5,
    safetyLevel: 'high',
    description: '커스텀 도구 설명'
};

integration.addMCPTool(newTool);
```

### 트리거 패턴 확장
```javascript  
// 새로운 트리거 패턴 추가
this.triggerPatterns['AI분석'] = 'customAI';
this.triggerPatterns['데이터처리'] = 'dataProcessor';
```

## ⚡ 빠른 시작 가이드

### 1. 시스템 준비
```bash
cd /Users/Jadaking/jadaking-actor
npm install
```

### 2. MCP 통합 실행
```bash
node banana-ai-mcp-integration.js
```

### 3. 안전성 모니터링 시작
```bash
node -e "
const MCPSafetyRecovery = require('./mcp-safety-recovery.js');
const safety = new MCPSafetyRecovery();
safety.startPeriodicMonitoring();
"
```

### 4. 트리거 테스트
```bash
echo '{"query": "웹자동화로 구글 검색해줘"}' | node main.js
```

## 🚨 응급 상황 대응

### 시스템 과부하시
```bash
# 응급 종료
node -e "
const MCPSafetyRecovery = require('./mcp-safety-recovery.js');
const safety = new MCPSafetyRecovery();
safety.emergencyShutdown();
"
```

### 복구 스크립트 실행
```bash
/Users/Jadaking/Scripts/docker-mcp-cleanup.sh
/Users/Jadaking/Scripts/optimize-mcp-servers.sh
```

## 📈 성능 최적화

### 권장 설정
- **동시 실행 제한**: 최대 5개 MCP 도구
- **메모리 할당**: 도구당 2GB 제한
- **실행 시간**: 30초 타임아웃
- **정리 주기**: 10분 간격 자동 정리

### 모니터링 대시보드
```javascript
// 실시간 상태 확인
const status = await integration.getSystemStatus();
console.log(`활성 도구: ${status.activeTools}`);
console.log(`메모리 사용량: ${status.memoryUsage}`);
console.log(`안전성 점수: ${status.safetyScore}`);
```

---

**💡 팁:** 복잡한 작업은 단계별로 나누어 실행하면 더 안전하고 효율적입니다.

**🔗 관련 파일:**
- `banana-ai-mcp-integration.js`: 메인 통합 시스템
- `mcp-safety-recovery.js`: 안전성 및 복구 시스템
- `main.js`: 기본 Apify Actor 실행부