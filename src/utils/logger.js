/**
 * Enhanced Logger with performance tracking and structured logging
 * @version 2.0
 */
class Logger {
    constructor(options = {}) {
        this.level = options.level || process.env.LOG_LEVEL || 'info';
        this.prefix = options.prefix || '[JadakingActor]';
        this.timestamp = options.timestamp !== false;
        this.enableColors = options.colors !== false && !process.env.NO_COLOR;
        this.performance = options.performance !== false;
        this.startTime = Date.now();
        
        // Color codes for different log levels
        this.colors = {
            error: '\x1b[31m',   // Red
            warn: '\x1b[33m',    // Yellow
            info: '\x1b[36m',    // Cyan
            debug: '\x1b[90m',   // Gray
            success: '\x1b[32m', // Green
            reset: '\x1b[0m'     // Reset
        };
    }

    _formatMessage(level, ...args) {
        const timestamp = this.timestamp ? `[${new Date().toISOString()}]` : '';
        const levelTag = this.enableColors 
            ? `${this.colors[level] || ''}[${level.toUpperCase()}]${this.colors.reset}`
            : `[${level.toUpperCase()}]`;
        
        // Add performance timing for debug level
        const timing = this.performance && level === 'debug' 
            ? `[+${Date.now() - this.startTime}ms]`
            : '';
            
        return [timestamp, levelTag, timing, this.prefix, ...args].filter(Boolean);
    }

    info(...args) {
        if (this._shouldLog('info')) {
            console.log(...this._formatMessage('info', ...args));
        }
    }

    warn(...args) {
        if (this._shouldLog('warn')) {
            console.warn(...this._formatMessage('warn', ...args));
        }
    }

    error(...args) {
        if (this._shouldLog('error')) {
            console.error(...this._formatMessage('error', ...args));
        }
    }

    debug(...args) {
        if (this._shouldLog('debug')) {
            console.debug(...this._formatMessage('debug', ...args));
        }
    }

    success(...args) {
        if (this._shouldLog('info')) {
            console.log(...this._formatMessage('success', ...args));
        }
    }

    // Structured logging methods
    logObject(level, label, obj) {
        if (this._shouldLog(level)) {
            this[level](`${label}:`, JSON.stringify(obj, null, 2));
        }
    }

    logError(error, context = '') {
        this.error(`${context} Error:`, error.message);
        if (process.env.NODE_ENV === 'development' && error.stack) {
            this.debug('Stack trace:', error.stack);
        }
    }

    logPerformance(label, startTime) {
        const duration = Date.now() - startTime;
        this.debug(`⏱️ ${label} completed in ${duration}ms`);
    }

    // Timer utility
    time(label) {
        return {
            label,
            startTime: Date.now(),
            end: () => this.logPerformance(label, Date.now())
        };
    }

    _shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
}

module.exports = Logger;