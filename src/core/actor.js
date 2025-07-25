const { Actor } = require('apify');
const config = require('../../config/default');
const Logger = require('../utils/logger');
const ErrorHandler = require('../middleware/error-handler');

class JadakingActor {
    constructor() {
        this.logger = new Logger();
        this.errorHandler = new ErrorHandler();
        this.handlers = new Map();
        this.middlewares = [];
    }

    /**
     * Register a handler for specific input types
     * @param {string} type - Handler type identifier
     * @param {Function} handler - Handler function
     */
    registerHandler(type, handler) {
        this.handlers.set(type, handler);
        this.logger.info(`Handler registered: ${type}`);
    }

    /**
     * Add middleware to processing pipeline
     * @param {Function} middleware - Middleware function
     */
    use(middleware) {
        this.middlewares.push(middleware);
        this.logger.info('Middleware added to pipeline');
    }

    /**
     * Process input through middleware pipeline
     * @param {Object} input - Raw input data
     * @param {Object} context - Processing context
     */
    async processMiddleware(input, context) {
        let processedInput = { ...input };
        
        for (const middleware of this.middlewares) {
            try {
                processedInput = await middleware(processedInput, context);
            } catch (error) {
                this.logger.error('Middleware error:', error);
                throw error;
            }
        }
        
        return processedInput;
    }

    /**
     * Execute handler based on input type
     * @param {Object} input - Processed input data
     * @param {Object} context - Processing context
     */
    async executeHandler(input, context) {
        const handlerType = input.type || config.defaultHandler || 'default';
        const handler = this.handlers.get(handlerType);

        if (!handler) {
            throw new Error(`No handler found for type: ${handlerType}`);
        }

        this.logger.info(`Executing handler: ${handlerType}`);
        return await handler(input, context);
    }

    /**
     * Main actor execution method
     */
    async run() {
        try {
            this.logger.info('🚀 JadakingActor starting...');
            
            const input = await Actor.getInput() || {};
            const context = {
                actorId: Actor.getEnv().actorId,
                runId: Actor.getEnv().actorRunId,
                timestamp: new Date().toISOString()
            };

            this.logger.info('Input received:', input);

            // Process through middleware pipeline
            const processedInput = await this.processMiddleware(input, context);

            // Execute appropriate handler
            const result = await this.executeHandler(processedInput, context);

            // Store result
            await Actor.pushData(result);
            
            this.logger.info('✅ Processing completed successfully');
            this.logger.info('Result:', result);

        } catch (error) {
            await this.errorHandler.handle(error);
            throw error;
        }
    }
}

module.exports = JadakingActor;