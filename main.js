const { Actor } = require('apify');

Actor.main(async () => {
    console.log('🔧 Actor starting...');
    
    const input = await Actor.getInput();
    console.log('🚀 Input received:', input);

    const result = {
        message: 'Hello from Jadaking!',
        query: input?.query || null,
        timestamp: new Date().toISOString(),
        actor_id: process.env.APIFY_ACTOR_ID || 'local',
        run_id: process.env.APIFY_ACTOR_RUN_ID || 'local'
    };

    await Actor.pushData(result);
    console.log('✅ Data pushed!', result);
});
