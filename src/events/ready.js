module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot online as ${client.user.tag}`);
    
    // Start fun facts interval if configured
    const channelId = process.env.FUN_FACT_CHANNEL_ID;
    const interval = process.env.FUN_FACT_INTERVAL || 3600000;
    
    if (channelId) {
      setInterval(() => require('../commands/funfact').postRandom(client), interval);
      console.log(`🎲 Fun facts enabled every ${interval/3600000} hour(s)`);
    }
  },
};
