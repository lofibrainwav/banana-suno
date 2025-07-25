const JadakingActor = require('./src/core/actor');
const HandlerRegistry = require('./src/handlers/handler-registry');
const MiddlewareRegistry = require('./src/middleware/middleware-registry');

/**
 * Main entry point with new architecture
 */
async function main() {
    try {
        // Create actor instance
        const actor = new JadakingActor();

        // Initialize handler registry
        const handlerRegistry = new HandlerRegistry();
        
        // Initialize middleware registry  
        const middlewareRegistry = new MiddlewareRegistry();

        // Override actor methods to use registries
        actor.executeHandler = async (input, context) => {
            const handlerType = input.type || 'default';
            return await handlerRegistry.execute(handlerType, input, context);
        };

        actor.processMiddleware = async (input, context) => {
            return await middlewareRegistry.process(input, context);
        };

        // Run the actor
        await actor.run();

    } catch (error) {
        console.error('❌ Actor execution failed:', error.message);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = main;