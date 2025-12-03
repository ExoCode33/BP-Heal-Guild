# Discord Word Tracker Bot

Clean, minimal Discord bot that tracks word usage and posts fun facts.

## Structure

```
├── index.js                 # Main entry - loads everything
├── config/
│   └── stopwords.js        # Words to ignore
├── src/
│   ├── events/             # Discord events
│   │   ├── ready.js        # Bot startup
│   │   └── messageCreate.js # Message handling
│   └── commands/           # Bot commands
│       ├── topwords.js     # !topwords
│       ├── mystats.js      # !mystats
│       ├── userstats.js    # !userstats @user
│       └── funfact.js      # !funfact
├── package.json
├── .env.example
└── .gitignore
```

## Setup

1. **Create `.env`** (copy from `.env.example`)
   ```
   DISCORD_TOKEN=your_token
   DATABASE_URL=your_postgres_url
   NODE_ENV=production
   FUN_FACT_CHANNEL_ID=channel_id (optional)
   FUN_FACT_INTERVAL=3600000 (optional, 1 hour)
   ```

2. **Install**
   ```bash
   npm install
   ```

3. **Run**
   ```bash
   npm start
   ```

## Commands

- `!topwords [limit]` - Most used words
- `!mystats` - Your top 10 words
- `!userstats @user` - Someone else's top 10
- `!funfact` - Random fun fact

## Adding Features

### New Command
Create `src/commands/yourcommand.js`:
```javascript
module.exports = {
  name: 'yourcommand',
  description: 'What it does',
  async execute(message, args, client) {
    // Your code
    message.reply('Response');
  },
};
```

### New Event
Create `src/events/yourevent.js`:
```javascript
module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    // Your code
  },
};
```

### Modify Stopwords
Edit `config/stopwords.js` - add words you don't want tracked.

## Deploy to Railway

1. Push to GitHub
2. Create Railway project from repo
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

## Database

Two tables auto-created on startup:
- `word_frequency` - Global word counts
- `user_word_frequency` - Per-user word counts

---

That's it! Simple, clean, easy to expand. 🚀
