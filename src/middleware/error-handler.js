const { Actor } = require('apify');
const Logger = require('../utils/logger');

class ErrorHandler {
    constructor() {
        this.logger = new Logger({ prefix: '[ErrorHandler]' });
    }

    /**
     * Handle different types of errors
     * @param {Error} error - The error to handle
     */
    async handle(error) {
        this.logger.error('Error occurred:', error.message);
        this.logger.error('Stack trace:', error.stack);

        // Categorize error types
        const errorInfo = this._categorizeError(error);
        
        // Log structured error data
        await this._logError(errorInfo);
        
        // Set actor exit code based on error type
        this._setExitCode(errorInfo);
    }

    /**
     * Categorize error by type and severity
     */
    _categorizeError(error) {
        const errorInfo = {
            type: 'unknown',
            severity: 'high',
            retryable: false,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        };

        // Network/API errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            errorInfo.type = 'network';
            errorInfo.retryable = true;
            errorInfo.severity = 'medium';
        }
        
        // Validation errors
        else if (error.name === 'ValidationError') {
            errorInfo.type = 'validation';
            errorInfo.retryable = false;
            errorInfo.severity = 'low';
        }
        
        // Timeout errors
        else if (error.name === 'TimeoutError') {
            errorInfo.type = 'timeout';
            errorInfo.retryable = true;
            errorInfo.severity = 'medium';
        }
        
        // Rate limiting
        else if (error.statusCode === 429) {
            errorInfo.type = 'rate_limit';
            errorInfo.retryable = true;
            errorInfo.severity = 'low';
        }

        return errorInfo;
    }

    /**
     * Log error in structured format
     */
    async _logError(errorInfo) {
        try {
            await Actor.pushData({
                _type: 'error_log',
                ...errorInfo
            });
        } catch (logError) {
            this.logger.error('Failed to log error:', logError.message);
        }
    }

    /**
     * Set appropriate exit code
     */
    _setExitCode(errorInfo) {
        // Set exit code based on error type
        const exitCodes = {
            validation: 1,
            network: 2,
            timeout: 3,
            rate_limit: 4,
            unknown: 5
        };

        const exitCode = exitCodes[errorInfo.type] || 5;
        process.exitCode = exitCode;
        
        this.logger.info(`Set exit code: ${exitCode} for error type: ${errorInfo.type}`);
    }
}

module.exports = ErrorHandler;