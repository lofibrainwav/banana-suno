/**
 * 바나나AI MCP 트리거 테스트 스위트
 */

const BananaAIMCPIntegration = require('./banana-ai-mcp-integration.js');
const MCPSafetyRecovery = require('./mcp-safety-recovery.js');

class BananaAITriggerTest {
    constructor() {
        this.integration = new BananaAIMCPIntegration();
        this.safety = new MCPSafetyRecovery();
        this.testScenarios = [
            {
                name: '웹 자동화 트리거',
                input: { query: '웹자동화로 구글에서 AI 뉴스 검색해줘' },
                expectedTool: 'playwright-mcp-server'
            },
            {
                name: '시스템 관리 트리거', 
                input: { query: '시스템관리로 현재 프로세스 확인해줘' },
                expectedTool: 'desktop-commander'
            },
            {
                name: '클라우드 배포 트리거',
                input: { query: '클라우드배포로 새 서비스 올려줘' },
                expectedTool: 'render'
            },
            {
                name: '벡터 검색 트리거',
                input: { query: '벡터검색으로 유사한 문서 찾아줘' },
                expectedTool: 'chroma'
            },
            {
                name: '버전 관리 트리거',
                input: { query: '깃관리로 코드 커밋하고 푸시해줘' },
                expectedTool: 'git'
            },
            {
                name: '복합 트리거 테스트',
                input: { query: '깃관리로 커밋하고 클라우드배포로 서비스 올려줘' },
                expectedTools: ['git', 'render']
            },
            {
                name: '알 수 없는 트리거',
                input: { query: '날씨가 어때?' },
                expectedResult: 'research'
            }
        ];
    }
    
    /**
     * 전체 테스트 실행
     */
    async runAllTests() {
        console.log('🍌 바나나AI MCP 트리거 테스트 시작\n');
        
        const results = [];
        
        for (const scenario of this.testScenarios) {
            const result = await this.runSingleTest(scenario);
            results.push(result);
            
            // 테스트 간 간격
            await this.sleep(1000);
        }
        
        return this.generateTestReport(results);
    }
    
    /**
     * 개별 테스트 실행
     */
    async runSingleTest(scenario) {
        console.log(`📋 테스트: ${scenario.name}`);
        console.log(`🔍 입력: ${scenario.input.query}`);
        
        try {
            // 트리거 분석
            const analysis = this.integration.analyzeTrigger(scenario.input);
            
            // 예상 결과와 비교
            const isCorrect = this.validateTestResult(scenario, analysis);
            
            // 안전성 검사
            const safetyCheck = await this.safety.performHealthCheck();
            
            const result = {
                scenario: scenario.name,
                input: scenario.input.query,
                analysis,
                isCorrect,
                safetyStatus: this.evaluateSafetyStatus(safetyCheck),
                timestamp: new Date().toISOString()
            };
            
            console.log(`✅ 결과: ${isCorrect ? '성공' : '실패'}`);
            console.log(`🛡️ 안전성: ${result.safetyStatus}`);
            console.log('---\n');
            
            return result;
            
        } catch (error) {
            console.log(`❌ 오류 발생: ${error.message}\n`);
            return {
                scenario: scenario.name,
                error: error.message,
                isCorrect: false,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    /**
     * 테스트 결과 검증
     */
    validateTestResult(scenario, analysis) {
        if (scenario.expectedTool) {
            // 단일 도구 예상
            return analysis.matchedTools.some(tool => 
                tool.name === scenario.expectedTool
            );
        } else if (scenario.expectedTools) {
            // 복수 도구 예상
            const matchedNames = analysis.matchedTools.map(t => t.name);
            return scenario.expectedTools.every(expected =>
                matchedNames.includes(expected)
            );
        } else if (scenario.expectedResult) {
            // 특정 결과 예상
            return analysis.recommendedExecution === scenario.expectedResult;
        }
        
        return false;
    }
    
    /**
     * 안전성 상태 평가
     */
    evaluateSafetyStatus(healthResults) {
        const healthyCount = Object.values(healthResults)
            .filter(result => result.status === 'healthy').length;
        const totalChecks = Object.keys(healthResults).length;
        
        const healthRatio = healthyCount / totalChecks;
        
        if (healthRatio >= 0.9) return '최적';
        if (healthRatio >= 0.7) return '양호';
        if (healthRatio >= 0.5) return '주의';
        return '위험';
    }
    
    /**
     * 테스트 리포트 생성
     */
    generateTestReport(results) {
        const successCount = results.filter(r => r.isCorrect).length;
        const totalTests = results.length;
        const successRate = (successCount / totalTests * 100).toFixed(1);
        
        const report = {
            summary: {
                totalTests,
                successCount,
                failureCount: totalTests - successCount,
                successRate: `${successRate}%`
            },
            details: results,
            systemStatus: {
                overallHealth: this.calculateOverallHealth(results),
                recommendations: this.generateRecommendations(results)
            },
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 테스트 결과 요약:');
        console.log(`전체 테스트: ${totalTests}개`);
        console.log(`성공: ${successCount}개`);
        console.log(`실패: ${totalTests - successCount}개`);
        console.log(`성공률: ${successRate}%`);
        console.log(`시스템 상태: ${report.systemStatus.overallHealth}`);
        
        return report;
    }
    
    /**
     * 전체 시스템 상태 계산
     */
    calculateOverallHealth(results) {
        const safetyStatuses = results
            .filter(r => r.safetyStatus)
            .map(r => r.safetyStatus);
        
        if (safetyStatuses.every(s => s === '최적')) return '최적';
        if (safetyStatuses.some(s => s === '위험')) return '주의 필요';
        return '양호';
    }
    
    /**
     * 개선 권장사항 생성
     */
    generateRecommendations(results) {
        const recommendations = [];
        
        const failedTests = results.filter(r => !r.isCorrect);
        if (failedTests.length > 0) {
            recommendations.push('실패한 트리거 패턴 재검토 필요');
        }
        
        const unsafeTests = results.filter(r => 
            r.safetyStatus === '주의' || r.safetyStatus === '위험'
        );
        if (unsafeTests.length > 0) {
            recommendations.push('안전성 모니터링 강화 필요');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('시스템 정상 동작 중');
        }
        
        return recommendations;
    }
    
    /**
     * 성능 벤치마크 테스트
     */
    async runPerformanceTest() {
        console.log('⚡ 성능 벤치마크 테스트 시작\n');
        
        const testQuery = { query: '웹자동화로 빠른 검색 테스트' };
        const iterations = 10;
        const executionTimes = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();
            
            const analysis = this.integration.analyzeTrigger(testQuery);
            if (analysis.matchedTools.length > 0) {
                await this.integration.executeMCPTool(analysis.matchedTools[0]);
            }
            
            const endTime = Date.now();
            const executionTime = endTime - startTime;
            executionTimes.push(executionTime);
            
            console.log(`반복 ${i + 1}: ${executionTime}ms`);
        }
        
        const avgTime = executionTimes.reduce((a, b) => a + b, 0) / iterations;
        const minTime = Math.min(...executionTimes);
        const maxTime = Math.max(...executionTimes);
        
        console.log(`\n📈 성능 결과:`);
        console.log(`평균 실행 시간: ${avgTime.toFixed(2)}ms`);
        console.log(`최소 실행 시간: ${minTime}ms`);
        console.log(`최대 실행 시간: ${maxTime}ms`);
        
        return {
            averageExecutionTime: avgTime,
            minExecutionTime: minTime,
            maxExecutionTime: maxTime,
            totalIterations: iterations
        };
    }
    
    /**
     * 대기 함수
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 직접 실행 시 테스트 수행
if (require.main === module) {
    (async () => {
        const tester = new BananaAITriggerTest();
        
        // 기본 트리거 테스트
        const testResults = await tester.runAllTests();
        
        // 성능 테스트
        const performanceResults = await tester.runPerformanceTest();
        
        // 결과 저장
        const fs = require('fs').promises;
        const reportPath = './test-results.json';
        
        const fullReport = {
            triggerTests: testResults,
            performanceTests: performanceResults,
            generatedAt: new Date().toISOString()
        };
        
        await fs.writeFile(reportPath, JSON.stringify(fullReport, null, 2));
        console.log(`\n💾 테스트 결과 저장: ${reportPath}`);
    })();
}

module.exports = BananaAITriggerTest;