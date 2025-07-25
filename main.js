const { Actor } = require('apify');

// Memory optimization: Enable garbage collection
if (global.gc) {
    global.gc();
}

/**
 * Enhanced Jadaking Actor with improved error handling and validation
 * @version 2.0
 */
Actor.main(async () => {
    try {
        console.log('🔧 Enhanced Actor starting...');
        
        // Get input with validation
        const input = await Actor.getInput();
        console.log('🚀 Input received:', JSON.stringify(input, null, 2));

        // Validate input
        if (!input) {
            console.warn('⚠️ No input provided, using defaults');
        }

        // Enhanced processing logic
        const result = {
            message: 'Hello from Enhanced Jadaking!',
            query: input?.query || 'default',
            timestamp: new Date().toISOString(),
            processedAt: Date.now(),
            version: '2.0',
            actor_id: process.env.APIFY_ACTOR_ID || 'local',
            run_id: process.env.APIFY_ACTOR_RUN_ID || 'local',
            environment: process.env.NODE_ENV || 'development',
            features: {
                errorHandling: true,
                validation: true,
                enhancedLogging: true,
                timestamping: true
            }
        };

        // Additional processing based on query type
        if (input?.query) {
            result.queryAnalysis = {
                length: input.query.length,
                type: typeof input.query,
                isEmpty: input.query.trim() === '',
                words: input.query.split(' ').length
            };
            
            console.log('📋 Query analysis:', result.queryAnalysis);
        }

        // Push enhanced result with memory optimization
        await Actor.pushData(result);
        
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }
        
        console.log('✅ Enhanced data pushed successfully!');
        console.log('📊 Result summary:', {
            message: result.message,
            query: result.query,
            timestamp: result.timestamp,
            version: result.version
        });

    } catch (error) {
        console.error('❌ Actor execution failed:', error.message);
        console.error('🔍 Error details:', error.stack);
        
        // Push error information for debugging
        const errorResult = {
            error: true,
            message: error.message,
            timestamp: new Date().toISOString(),
            actor_id: process.env.APIFY_ACTOR_ID || 'local',
            run_id: process.env.APIFY_ACTOR_RUN_ID || 'local',
            environment: process.env.NODE_ENV || 'development'
        };

        // Include stack trace in development
        if (process.env.NODE_ENV === 'development') {
            errorResult.stack = error.stack;
        }
        
        await Actor.pushData(errorResult);
        throw error; // Re-throw to ensure proper exit code
    }
});
