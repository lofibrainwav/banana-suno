const Logger = require('../utils/logger');
const config = require('../../config/environment').get();

class MiddlewareRegistry {
    constructor() {
        this.middlewares = [];
        this.logger = new Logger({ prefix: '[MiddlewareRegistry]' });
        this._initializeDefaultMiddlewares();
    }

    /**
     * Initialize built-in middlewares based on configuration
     */
    _initializeDefaultMiddlewares() {
        // Validation middleware
        if (config.middleware.validation.enabled) {
            const ValidationMiddleware = require('./validation-middleware');
            const validationMiddleware = new ValidationMiddleware({
                strict: config.middleware.validation.strict
            });
            this.use(validationMiddleware);
        }

        // Add other default middlewares here
    }

    /**
     * Add middleware to the pipeline
     * @param {Object} middleware - Middleware instance with process() method
     */
    use(middleware) {
        if (!middleware || typeof middleware.process !== 'function') {
            throw new Error('Middleware must have a process() method');
        }

        this.middlewares.push(middleware);
        this.logger.info(`Middleware added: ${middleware.constructor.name}`);
    }

    /**
     * Process input through all middlewares
     * @param {Object} input - Input data
     * @param {Object} context - Processing context
     */
    async process(input, context) {
        let processedInput = { ...input };
        
        this.logger.debug(`Processing through ${this.middlewares.length} middlewares`);

        for (let i = 0; i < this.middlewares.length; i++) {
            const middleware = this.middlewares[i];
            const middlewareName = middleware.constructor.name;
            
            try {
                this.logger.debug(`Processing middleware: ${middlewareName}`);
                const startTime = Date.now();
                
                processedInput = await middleware.process(processedInput, context);
                
                const duration = Date.now() - startTime;
                this.logger.debug(`Middleware '${middlewareName}' completed in ${duration}ms`);
                
            } catch (error) {
                this.logger.error(`Middleware '${middlewareName}' failed:`, error.message);
                throw error;
            }
        }

        return processedInput;
    }

    /**
     * Get number of registered middlewares
     */
    count() {
        return this.middlewares.length;
    }

    /**
     * Clear all middlewares
     */
    clear() {
        this.middlewares = [];
        this.logger.info('All middlewares cleared');
    }

    /**
     * Get middleware names
     */
    getNames() {
        return this.middlewares.map(m => m.constructor.name);
    }
}

module.exports = MiddlewareRegistry;