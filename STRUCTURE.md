# 🎯 Clean Bot Structure - Only 10 Files!

## 📁 File Structure

```
discord-bot-clean/
│
├── index.js                    # Main file - loads everything (65 lines)
├── package.json                # Dependencies (12 lines)
├── .env.example                # Config template (5 lines)
├── .gitignore                  # Git safety (4 lines)
├── README.md                   # Simple guide (80 lines)
│
├── config/
│   └── stopwords.js           # Words to ignore (8 lines)
│
└── src/
    ├── events/                # Discord events (2 files)
    │   ├── ready.js          # Bot startup (14 lines)
    │   └── messageCreate.js  # Track words + handle commands (59 lines)
    │
    └── commands/              # Bot commands (4 files)
        ├── topwords.js       # !topwords command (20 lines)
        ├── mystats.js        # !mystats command (18 lines)
        ├── userstats.js      # !userstats command (22 lines)
        └── funfact.js        # !funfact + auto-posting (82 lines)
```

## ✨ Total: 10 Files, ~389 Lines

Everything you need, nothing you don't!

---

## 🚀 How It Works

### Main Entry (`index.js`)
- Creates Discord client
- Connects to PostgreSQL
- Auto-loads all commands from `src/commands/`
- Auto-loads all events from `src/events/`
- Creates database tables
- That's it!

### Events
- **ready.js** - Runs when bot starts, sets up fun facts interval
- **messageCreate.js** - Tracks every word + handles all commands

### Commands
Each file = one command, automatically loaded!
- **topwords.js** - Shows most used words
- **mystats.js** - Your personal stats
- **userstats.js** - Check another user
- **funfact.js** - Random fun facts (manual + automatic)

### Config
- **stopwords.js** - Simple list of words to ignore

---

## ➕ Adding New Features

### Add a Command (30 seconds)
Create `src/commands/yourcommand.js`:
```javascript
module.exports = {
  name: 'yourcommand',
  description: 'What it does',
  async execute(message, args, client) {
    message.reply('Your response');
  },
};
```
Done! Auto-loaded, no imports needed.

### Add an Event (30 seconds)
Create `src/events/guildMemberAdd.js`:
```javascript
module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    // Do something when user joins
  },
};
```
Done! Auto-loaded, no imports needed.

### Modify Stopwords (10 seconds)
Edit `config/stopwords.js`, add words to the list.

---

## 🎮 Commands

- `!topwords` - Top 10 words
- `!topwords 25` - Top 25 words
- `!mystats` - Your top 10
- `!userstats @user` - Their top 10
- `!funfact` - Random fun fact

---

## ⚙️ Configuration

Copy `.env.example` to `.env`:
```env
DISCORD_TOKEN=your_bot_token
DATABASE_URL=postgresql://...
NODE_ENV=production
FUN_FACT_CHANNEL_ID=123456789  # Optional
FUN_FACT_INTERVAL=3600000      # Optional (1 hour)
```

---

## 🚀 Deploy to Railway

1. Push to GitHub
2. Railway: "New Project" → "From GitHub"
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

Railway auto-detects Node.js and runs `npm start`.

---

## 💡 Why This Structure?

✅ **Auto-loading** - Drop files in folders, they just work
✅ **One file per feature** - Easy to find and edit
✅ **No complex routing** - Commands auto-register
✅ **Easy to expand** - Add files, don't modify existing ones
✅ **Clean separation** - Events, commands, config all separate
✅ **Minimal** - Only 10 files, ~389 lines total

---

## 📦 What's Included

Same features as before:
- ✅ Word tracking
- ✅ User stats
- ✅ Fun facts
- ✅ PostgreSQL
- ✅ All commands

But now:
- ✅ 10 files instead of 20+
- ✅ Auto-loading system
- ✅ Super easy to expand
- ✅ Clean structure
- ✅ No complex modules

---

Perfect for:
- Quick deployment ⚡
- Easy customization 🎨
- Learning Discord bots 📚
- Rapid prototyping 🚀
