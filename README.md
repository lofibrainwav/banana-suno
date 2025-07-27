# Jadaking Actor - Refactored & Extensible

확장 가능하고 유연한 구조로 리팩토링된 Apify Actor 프로젝트


## 📋 프로젝트 요약
Banana AI와 Apify Actor를 통해 안전한 MCP 도구 실행 환경을 구축합니다. 세부 목표는 [prd/banana-suno-prd.md](prd/banana-suno-prd.md)에서 확인할 수 있습니다.

## 🛠️ 사전 준비
- Node.js 18 이상
- npm
- TypeScript

## 🚀 초기 설정
```bash
npm install
```

## 💻 예제 스크립트 실행
```bash
node main-refactored.js
node banana-ai-mcp-integration.js
```

## 🏗️ 아키텍처 개선사항

### Before (15줄 모노리틱)
```javascript
const { Actor } = require('apify');

Actor.main(async () => {
    const input = await Actor.getInput();
    console.log('🚀 Input received:', input);
    
    const result = {
        message: 'Hello from Jadaking!',
        query: input?.query || null
    };
    
    await Actor.pushData(result);
    console.log('✅ Data pushed!', result);
});
```

### After (모듈화된 구조)
- **핸들러 레지스트리**: 타입별 처리 로직 분리
- **미들웨어 파이프라인**: 검증, 로깅, 변환 등
- **환경별 설정**: development/production 분리
- **에러 처리**: 구조화된 에러 분류 및 처리
- **테스트 프레임워크**: Jest 기반 유닛 테스트

## 📁 프로젝트 구조

```
jadaking-actor/
├── src/
│   ├── core/
│   │   └── actor.js                    # 메인 Actor 클래스
│   ├── handlers/
│   │   ├── default-handler.js          # 기본 핸들러
│   │   └── handler-registry.js         # 핸들러 등록/실행
│   ├── middleware/
│   │   ├── validation-middleware.js    # 입력 검증
│   │   ├── middleware-registry.js      # 미들웨어 파이프라인
│   │   └── error-handler.js           # 에러 처리
│   └── utils/
│       ├── logger.js                  # 로깅 시스템
│       └── validation.js              # 검증 유틸리티
├── config/
│   ├── default.js                     # 기본 설정
│   ├── development.js                 # 개발 환경
│   ├── production.js                  # 운영 환경
│   └── environment.js                 # 환경 로더
├── test/
│   ├── core/
│   │   └── actor.test.js              # Actor 테스트
│   └── test-utils.js                  # 테스트 유틸리티
├── main.js                            # 기존 버전 (호환성)
├── main-refactored.js                 # 새 아키텍처 엔트리포인트
└── package.json
```

## 🚀 실행 방법

### 개발 환경
```bash
npm run dev
# 또는
NODE_ENV=development node main-refactored.js
```

### 운영 환경
```bash
npm run prod
# 또는  
NODE_ENV=production node main-refactored.js
```

### 기존 버전 (호환성)
```bash
npm start
# 또는
node main.js
```

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 감시 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage
```

## 🔧 확장 방법

### 1. 새 핸들러 추가
```javascript
// src/handlers/custom-handler.js
class CustomHandler {
    async handle(input, context) {
        return {
            message: 'Custom processing',
            data: input,
            timestamp: context.timestamp
        };
    }
}

// 등록
handlerRegistry.register('custom', new CustomHandler());
```

### 2. 미들웨어 추가
```javascript
// src/middleware/custom-middleware.js  
class CustomMiddleware {
    async process(input, context) {
        // 전처리 로직
        input.processed = true;
        return input;
    }
}

// 등록
middlewareRegistry.use(new CustomMiddleware());
```

### 3. 환경별 설정
```javascript
// config/staging.js
module.exports = {
    logging: {
        level: 'info'
    },
    errorHandling: {
        retryAttempts: 3
    }
};
```

## 📊 주요 기능

### ✅ 완료된 기능
- [x] 모듈화된 아키텍처 구조
- [x] 핸들러 레지스트리 시스템
- [x] 미들웨어 파이프라인
- [x] 환경별 설정 분리
- [x] 구조화된 에러 처리
- [x] 로깅 시스템
- [x] 테스트 프레임워크
- [x] 입력 검증 및 보안

### 🔄 향후 확장 계획
- [ ] TypeScript 마이그레이션
- [ ] 플러그인 시스템
- [ ] 성능 모니터링
- [ ] 캐싱 레이어
- [ ] API 문서화

## 🛡️ 보안 기능

- **입력 검증**: XSS 방지, 길이 제한
- **에러 분류**: 민감 정보 노출 방지  
- **환경 분리**: 개발/운영 설정 격리
- **로그 보안**: 구조화된 로깅

## 📈 성능

- **모듈 로딩**: 필요시에만 로드
- **에러 처리**: 빠른 실패 패턴
- **메모리**: 효율적인 객체 재사용
- **확장성**: 수평적 핸들러 확장

이제 15줄 코드가 완전히 확장 가능하고 유지보수 가능한 아키텍처로 발전했습니다! 🎉