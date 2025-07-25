/**
 * Testing utilities and helpers
 */
class TestUtils {
    /**
     * Create mock Actor environment
     */
    static createMockActor() {
        const mockData = [];
        
        return {
            getInput: jest.fn().mockResolvedValue({ query: 'test' }),
            pushData: jest.fn().mockImplementation(data => {
                mockData.push(data);
                return Promise.resolve();
            }),
            getEnv: jest.fn().mockReturnValue({
                actorId: 'test-actor-id',
                actorRunId: 'test-run-id'
            }),
            _getMockData: () => mockData,
            _clearMockData: () => mockData.length = 0
        };
    }

    /**
     * Create test input with default values
     */
    static createTestInput(overrides = {}) {
        return {
            query: 'test query',
            type: 'default',
            ...overrides
        };
    }

    /**
     * Create test context
     */
    static createTestContext(overrides = {}) {
        return {
            actorId: 'test-actor-id',
            runId: 'test-run-id',
            timestamp: '2023-01-01T00:00:00.000Z',
            ...overrides
        };
    }

    /**
     * Assert that result has expected structure
     */
    static assertResultStructure(result) {
        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('metadata');
        expect(result.metadata).toHaveProperty('version');
        expect(result.metadata).toHaveProperty('handler');
    }

    /**
     * Create delayed promise for testing timeouts
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate random test data
     */
    static generateRandomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Capture console output for testing
     */
    static captureConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        const logs = [];
        
        console.log = (...args) => logs.push({ type: 'log', args });
        console.error = (...args) => logs.push({ type: 'error', args });
        console.warn = (...args) => logs.push({ type: 'warn', args });
        
        return {
            getLogs: () => logs,
            restore: () => {
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
            }
        };
    }
}

module.exports = TestUtils;