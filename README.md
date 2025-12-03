# Discord Word Tracker Bot - Slash Commands

Clean Discord bot with slash commands that tracks word usage and posts fun facts.

## Commands

- `/topwords [limit]` - Most used words
- `/mystats` - Your top 10 words
- `/userstats @user` - Someone else's top 10
- `/funfact` - Random fun fact

## Setup

1. **Create `.env`** (copy from `.env.example`)
```
   DISCORD_TOKEN=your_token
   CLIENT_ID=your_application_id
   DATABASE_URL=your_postgres_url
   NODE_ENV=production
```

2. **Install**
```bash
   npm install
```

3. **Run**
```bash
   npm start
```

## Deploy to Railway

1. Push to GitHub
2. Create Railway project from repo
3. Add PostgreSQL database
4. Set environment variables:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `NODE_ENV=production`
5. Deploy!

Railway auto-provides `DATABASE_URL`.
```

---

## 🎯 **Structure**
```
discord-bot/
├── index.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── config/
│   └── stopwords.js
└── src/
    ├── events/
    │   ├── ready.js
    │   ├── messageCreate.js
    │   └── interactionCreate.js  ← NEW for slash commands
    └── commands/
        ├── topwords.js
        ├── mystats.js
        ├── userstats.js
        └── funfact.js
```

---

## ⚙️ **Railway Variables**
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
NODE_ENV=production
```

Optional:
```
FUN_FACT_CHANNEL_ID=channel_id
FUN_FACT_INTERVAL=3600000
