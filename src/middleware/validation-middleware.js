const Logger = require('../utils/logger');

class ValidationMiddleware {
    constructor(options = {}) {
        this.strict = options.strict || false;
        this.logger = new Logger({ prefix: '[ValidationMiddleware]' });
    }

    /**
     * Middleware function for input validation
     * @param {Object} input - Input to validate
     * @param {Object} context - Processing context
     */
    async process(input, context) {
        this.logger.debug('Validating input');

        // Basic input validation
        const validatedInput = {
            ...input,
            _validated: true,
            _validationTimestamp: new Date().toISOString()
        };

        // Validate input structure
        this._validateStructure(validatedInput);

        // Sanitize input
        this._sanitizeInput(validatedInput);

        // Type validation
        this._validateTypes(validatedInput);

        this.logger.debug('Input validation completed');
        return validatedInput;
    }

    /**
     * Validate basic input structure
     */
    _validateStructure(input) {
        if (typeof input !== 'object' || input === null) {
            throw new ValidationError('Input must be an object');
        }

        // Check for required fields in strict mode
        if (this.strict && !input.type) {
            this.logger.warn('Missing type field in strict mode');
        }
    }

    /**
     * Sanitize input values
     */
    _sanitizeInput(input) {
        // Sanitize string fields
        Object.keys(input).forEach(key => {
            if (typeof input[key] === 'string') {
                // Remove potential XSS patterns
                input[key] = input[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .trim();
            }
        });

        // Limit string lengths
        if (input.query && input.query.length > 1000) {
            input.query = input.query.substring(0, 1000);
            this.logger.warn('Query truncated to 1000 characters');
        }
    }

    /**
     * Validate field types
     */
    _validateTypes(input) {
        if (input.type && typeof input.type !== 'string') {
            throw new ValidationError('Type field must be a string');
        }

        if (input.query && typeof input.query !== 'string') {
            throw new ValidationError('Query field must be a string');
        }

        if (input.options && typeof input.options !== 'object') {
            throw new ValidationError('Options field must be an object');
        }
    }
}

/**
 * Custom validation error class
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

module.exports = ValidationMiddleware;