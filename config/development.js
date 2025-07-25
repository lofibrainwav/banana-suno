module.exports = {
    // Development-specific overrides
    logging: {
        level: 'debug'
    },

    errorHandling: {
        exitOnError: false, // Don't exit on errors in development
        retryAttempts: 1 // Fewer retries for faster feedback
    },

    middleware: {
        validation: {
            strict: false // More lenient validation
        }
    }
};