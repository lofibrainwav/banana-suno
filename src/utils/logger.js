class Logger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.prefix = options.prefix || '[JadakingActor]';
        this.timestamp = options.timestamp !== false;
    }

    _formatMessage(level, ...args) {
        const timestamp = this.timestamp ? `[${new Date().toISOString()}]` : '';
        const levelTag = `[${level.toUpperCase()}]`;
        return [timestamp, levelTag, this.prefix, ...args].filter(Boolean);
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

    _shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
}

module.exports = Logger;