const JadakingActor = require('../../src/core/actor');
const TestUtils = require('../test-utils');

// Mock Apify
jest.mock('apify');
const { Actor } = require('apify');

describe('JadakingActor', () => {
    let actor;
    let mockActor;

    beforeEach(() => {
        actor = new JadakingActor();
        mockActor = TestUtils.createMockActor();
        
        // Setup Actor mocks
        Actor.getInput = mockActor.getInput;
        Actor.pushData = mockActor.pushData;
        Actor.getEnv = mockActor.getEnv;
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockActor._clearMockData();
    });

    describe('initialization', () => {
        test('should initialize with default components', () => {
            expect(actor.logger).toBeDefined();
            expect(actor.errorHandler).toBeDefined();
            expect(actor.handlers).toBeInstanceOf(Map);
            expect(actor.middlewares).toBeInstanceOf(Array);
        });
    });

    describe('handler registration', () => {
        test('should register handler successfully', () => {
            const mockHandler = jest.fn();
            actor.registerHandler('test', mockHandler);
            
            expect(actor.handlers.get('test')).toBe(mockHandler);
        });

        test('should register multiple handlers', () => {
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            
            actor.registerHandler('type1', handler1);
            actor.registerHandler('type2', handler2);
            
            expect(actor.handlers.size).toBe(2);
        });
    });

    describe('middleware system', () => {
        test('should add middleware to pipeline', () => {
            const middleware = jest.fn();
            actor.use(middleware);
            
            expect(actor.middlewares).toContain(middleware);
        });

        test('should process middleware in order', async () => {
            const order = [];
            const middleware1 = jest.fn(async (input) => {
                order.push('middleware1');
                return input;
            });
            const middleware2 = jest.fn(async (input) => {
                order.push('middleware2');
                return input;
            });

            actor.use(middleware1);
            actor.use(middleware2);

            const input = TestUtils.createTestInput();
            const context = TestUtils.createTestContext();

            await actor.processMiddleware(input, context);

            expect(order).toEqual(['middleware1', 'middleware2']);
        });

        test('should handle middleware errors', async () => {
            const errorMiddleware = jest.fn().mockRejectedValue(new Error('Middleware error'));
            actor.use(errorMiddleware);

            const input = TestUtils.createTestInput();
            const context = TestUtils.createTestContext();

            await expect(actor.processMiddleware(input, context)).rejects.toThrow('Middleware error');
        });
    });

    describe('handler execution', () => {
        test('should execute registered handler', async () => {
            const mockHandler = jest.fn().mockResolvedValue({ result: 'success' });
            actor.registerHandler('test', mockHandler);

            const input = { type: 'test' };
            const context = TestUtils.createTestContext();

            const result = await actor.executeHandler(input, context);

            expect(mockHandler).toHaveBeenCalledWith(input, context);
            expect(result).toEqual({ result: 'success' });
        });

        test('should throw error for missing handler', async () => {
            const input = { type: 'nonexistent' };
            const context = TestUtils.createTestContext();

            await expect(actor.executeHandler(input, context)).rejects.toThrow('No handler found for type: nonexistent');
        });
    });

    describe('run method', () => {
        test('should complete full processing cycle', async () => {
            // Setup mock handler
            const mockHandler = jest.fn().mockResolvedValue({
                message: 'Test result',
                timestamp: '2023-01-01T00:00:00.000Z'
            });
            actor.registerHandler('default', mockHandler);

            await actor.run();

            expect(Actor.getInput).toHaveBeenCalled();
            expect(Actor.pushData).toHaveBeenCalled();
            expect(mockHandler).toHaveBeenCalled();
        });

        test('should handle errors gracefully', async () => {
            const mockHandler = jest.fn().mockRejectedValue(new Error('Handler error'));
            actor.registerHandler('default', mockHandler);

            await expect(actor.run()).rejects.toThrow('Handler error');
        });
    });
});