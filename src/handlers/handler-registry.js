const Logger = require('../utils/logger');

class HandlerRegistry {
    constructor() {
        this.handlers = new Map();
        this.logger = new Logger({ prefix: '[HandlerRegistry]' });
        this._initializeDefaultHandlers();
    }

    /**
     * Initialize built-in handlers
     */
    _initializeDefaultHandlers() {
        const DefaultHandler = require('./default-handler');
        this.register('default', new DefaultHandler());
    }

    /**
     * Register a handler
     * @param {string} type - Handler type identifier
     * @param {Object} handler - Handler instance with handle() method
     */
    register(type, handler) {
        if (!handler || typeof handler.handle !== 'function') {
            throw new Error(`Handler for type '${type}' must have a handle() method`);
        }

        this.handlers.set(type, handler);
        this.logger.info(`Handler registered: ${type}`);
    }

    /**
     * Unregister a handler
     * @param {string} type - Handler type identifier
     */
    unregister(type) {
        if (this.handlers.has(type)) {
            this.handlers.delete(type);
            this.logger.info(`Handler unregistered: ${type}`);
        }
    }

    /**
     * Get handler by type
     * @param {string} type - Handler type identifier
     */
    get(type) {
        return this.handlers.get(type);
    }

    /**
     * Check if handler exists
     * @param {string} type - Handler type identifier
     */
    has(type) {
        return this.handlers.has(type);
    }

    /**
     * Get all registered handler types
     */
    getTypes() {
        return Array.from(this.handlers.keys());
    }

    /**
     * Execute handler with error handling
     * @param {string} type - Handler type
     * @param {Object} input - Input data
     * @param {Object} context - Processing context
     */
    async execute(type, input, context) {
        const handler = this.get(type);
        
        if (!handler) {
            throw new Error(`No handler found for type: ${type}`);
        }

        this.logger.info(`Executing handler: ${type}`);
        
        try {
            const startTime = Date.now();
            const result = await handler.handle(input, context);
            const duration = Date.now() - startTime;
            
            this.logger.debug(`Handler '${type}' completed in ${duration}ms`);
            
            return {
                ...result,
                metadata: {
                    ...result.metadata,
                    executionTime: duration,
                    handler: type
                }
            };
        } catch (error) {
            this.logger.error(`Handler '${type}' failed:`, error.message);
            throw error;
        }
    }
}

module.exports = HandlerRegistry;