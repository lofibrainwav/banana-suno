const path = require('path');

/**
 * Environment-specific configuration loader
 */
class Environment {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        this.config = this._loadConfig();
    }

    _loadConfig() {
        const baseConfig = require('./default.js');
        
        try {
            // Try to load environment-specific config
            const envConfig = require(`./${this.env}.js`);
            return this._mergeDeep(baseConfig, envConfig);
        } catch (error) {
            // If no environment-specific config exists, use default
            console.warn(`No configuration found for environment: ${this.env}, using default`);
            return baseConfig;
        }
    }

    _mergeDeep(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this._mergeDeep(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    get() {
        return this.config;
    }

    getEnv() {
        return this.env;
    }

    isDevelopment() {
        return this.env === 'development';
    }

    isProduction() {
        return this.env === 'production';
    }

    isTest() {
        return this.env === 'test';
    }
}

module.exports = new Environment();