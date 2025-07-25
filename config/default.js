module.exports = {
    // Actor configuration
    actor: {
        name: 'jadaking-actor',
        version: '1.0.0',
        description: 'Flexible and extensible Apify actor',
        defaultHandler: 'default'
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        timestamp: true,
        prefix: '[JadakingActor]'
    },

    // Error handling configuration
    errorHandling: {
        logErrors: true,
        exitOnError: true,
        retryAttempts: 3,
        retryDelay: 1000
    },

    // Handler configuration
    handlers: {
        timeout: 30000, // 30 seconds
        maxConcurrent: 10
    },

    // Middleware configuration
    middleware: {
        validation: {
            enabled: true,
            strict: false
        },
        rateLimit: {
            enabled: false,
            requests: 100,
            window: 60000 // 1 minute
        },
        cache: {
            enabled: false,
            ttl: 300000 // 5 minutes
        }
    },

    // Data storage configuration
    storage: {
        autoFlush: true,
        batchSize: 100,
        includeMetadata: true
    }
};