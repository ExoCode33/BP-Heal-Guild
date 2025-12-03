module.exports = {
  name: 'clientReady',
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
```

**What changed:** 
- Line 2: `name: 'ready'` → `name: 'clientReady'`

---

## 📝 **Steps**

1. Open `src/events/ready.js` in your code editor
2. Change line 2 from `name: 'ready'` to `name: 'clientReady'`
3. Save the file
4. Push to GitHub
5. Railway will auto-redeploy

---

## ✅ **After Fix**

Your logs will show:
```
Registering slash commands...
Database ready
✅ Slash commands registered!
✅ Bot online as BP-Heal-Guild#2817
🎲 Fun facts enabled every 1 hour(s)
