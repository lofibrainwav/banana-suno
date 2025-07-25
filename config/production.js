module.exports = {
    // Production-specific overrides
    logging: {
        level: 'warn' // Reduce logging in production
    },

    errorHandling: {
        exitOnError: true,
        retryAttempts: 5, // More retries in production
        retryDelay: 2000
    },

    middleware: {
        validation: {
            strict: true // Strict validation in production
        },
        rateLimit: {
            enabled: true // Enable rate limiting
        }
    }
};