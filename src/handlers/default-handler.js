const Logger = require('../utils/logger');

class DefaultHandler {
    constructor() {
        this.logger = new Logger({ prefix: '[DefaultHandler]' });
    }

    /**
     * Default handler implementation
     * @param {Object} input - Processed input data
     * @param {Object} context - Processing context
     */
    async handle(input, context) {
        this.logger.info('Processing default request');
        
        const result = {
            message: 'Hello from Jadaking!',
            query: input.query || null,
            type: input.type || 'default',
            timestamp: context.timestamp,
            actorRunId: context.runId,
            metadata: {
                version: '2.0.0',
                handler: 'default',
                processingTime: Date.now()
            }
        };

        // Add custom processing logic here
        if (input.query) {
            result.response = this._processQuery(input.query);
        }

        this.logger.debug('Default handler result:', result);
        return result;
    }

    /**
     * Process query with basic logic
     * @param {string} query - Query string to process
     */
    _processQuery(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('ping')) {
            return 'pong';
        } else if (lowerQuery.includes('hello')) {
            return 'Hello there!';
        } else if (lowerQuery.includes('time')) {
            return new Date().toISOString();
        } else {
            return `Processed query: ${query}`;
        }
    }
}

module.exports = DefaultHandler;