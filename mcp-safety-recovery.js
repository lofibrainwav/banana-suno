/**
 * MCP 도구 안전성 및 자동 복구 시스템
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class MCPSafetyRecovery {
    constructor() {
        this.logPath = '/Users/Jadaking/Library/Logs/mcp-safety.log';
        this.recoveryScripts = {
            cleanup: '/Users/Jadaking/Scripts/docker-mcp-cleanup.sh',
            optimize: '/Users/Jadaking/Scripts/optimize-mcp-servers.sh'
        };
        
        this.healthChecks = {
            dockerGateway: 'docker mcp gateway run --dry-run',
            mcpServers: 'claude mcp list',
            containerHealth: 'docker ps --filter label=docker-mcp=true',
            memoryUsage: 'docker stats --no-stream --format "table {{.Container}}\\t{{.MemUsage}}"'
        };
    }
    
    /**
     * 전체 시스템 상태 검사
     */
    async performHealthCheck() {
        const results = {};
        
        for (const [check, command] of Object.entries(this.healthChecks)) {
            try {
                const result = await this.executeCommand(command);
                results[check] = {
                    status: 'healthy',
                    output: result.stdout,
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                results[check] = {
                    status: 'unhealthy',
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        }
        
        return results;
    }
    
    /**
     * 명령어 실행 (Promise 래퍼)
     */
    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    }
    
    /**
     * 자동 복구 시스템
     */
    async autoRecover(healthResults) {
        const recoveryActions = [];
        
        // Docker 컨테이너 문제 감지
        if (healthResults.containerHealth?.status === 'unhealthy') {
            recoveryActions.push({
                action: 'docker-cleanup',
                script: this.recoveryScripts.cleanup,
                reason: 'Docker 컨테이너 상태 이상'
            });
        }
        
        // MCP 서버 응답 불량 감지
        if (healthResults.mcpServers?.status === 'unhealthy') {
            recoveryActions.push({
                action: 'mcp-optimize',
                script: this.recoveryScripts.optimize,
                reason: 'MCP 서버 응답 불량'
            });
        }
        
        // 복구 액션 실행
        const recoveryResults = [];
        for (const action of recoveryActions) {
            try {
                const result = await this.executeCommand(`chmod +x ${action.script} && ${action.script}`);
                recoveryResults.push({
                    action: action.action,
                    status: 'success',
                    output: result.stdout
                });
            } catch (error) {
                recoveryResults.push({
                    action: action.action,
                    status: 'failed',
                    error: error.message
                });
            }
        }
        
        return recoveryResults;
    }
    
    /**
     * 메모리 사용량 모니터링
     */
    async monitorMemoryUsage() {
        try {
            const result = await this.executeCommand(this.healthChecks.memoryUsage);
            const lines = result.stdout.split('\n').slice(1); // 헤더 제외
            
            const memStats = lines
                .filter(line => line.trim())
                .map(line => {
                    const parts = line.split(/\s+/);
                    return {
                        container: parts[0],
                        memUsage: parts[1]
                    };
                });
            
            // 메모리 사용량이 1.5GB 이상인 컨테이너 감지
            const highMemContainers = memStats.filter(stat => {
                const usage = parseFloat(stat.memUsage);
                return usage > 1500; // 1.5GB
            });
            
            return {
                allContainers: memStats,
                highMemoryContainers: highMemContainers,
                needsCleanup: highMemContainers.length > 0
            };
        } catch (error) {
            return {
                error: error.message,
                needsCleanup: true
            };
        }
    }
    
    /**
     * 안전성 로그 기록
     */
    async logSafetyEvent(event) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event.type,
            details: event.details,
            severity: event.severity || 'info'
        };
        
        try {
            await fs.appendFile(this.logPath, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('로그 기록 실패:', error);
        }
    }
    
    /**
     * 정기적 상태 모니터링 (10분 간격)
     */
    startPeriodicMonitoring() {
        const monitoringInterval = 10 * 60 * 1000; // 10분
        
        setInterval(async () => {
            const healthResults = await this.performHealthCheck();
            const memoryStats = await this.monitorMemoryUsage();
            
            // 문제 감지시 자동 복구
            const unhealthyServices = Object.entries(healthResults)
                .filter(([_, result]) => result.status === 'unhealthy');
            
            if (unhealthyServices.length > 0 || memoryStats.needsCleanup) {
                const recoveryResults = await this.autoRecover(healthResults);
                
                await this.logSafetyEvent({
                    type: 'auto-recovery',
                    details: {
                        unhealthyServices,
                        memoryStats,
                        recoveryResults
                    },
                    severity: 'warning'
                });
            }
        }, monitoringInterval);
    }
    
    /**
     * 응급 종료 프로토콜
     */
    async emergencyShutdown() {
        const shutdownSteps = [
            'docker stop $(docker ps -q --filter label=docker-mcp=true)',
            'docker container prune -f',
            'docker image prune -f'
        ];
        
        const results = [];
        for (const step of shutdownSteps) {
            try {
                const result = await this.executeCommand(step);
                results.push({ step, status: 'success', output: result.stdout });
            } catch (error) {
                results.push({ step, status: 'failed', error: error.message });
            }
        }
        
        await this.logSafetyEvent({
            type: 'emergency-shutdown',
            details: { shutdownSteps: results },
            severity: 'critical'
        });
        
        return results;
    }
}

module.exports = MCPSafetyRecovery;