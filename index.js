require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create PostgreSQL connection pool
client.db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Load commands
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'src/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, 'src/events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Initialize database
client.db.query(`
  CREATE TABLE IF NOT EXISTS word_frequency (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL UNIQUE,
    count INTEGER DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_word ON word_frequency(word);
  CREATE INDEX IF NOT EXISTS idx_count ON word_frequency(count DESC);
  
  CREATE TABLE IF NOT EXISTS user_word_frequency (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    word VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word)
  );
  CREATE INDEX IF NOT EXISTS idx_user_word ON user_word_frequency(user_id, word);
`).then(() => console.log('Database ready')).catch(console.error);

// Login
client.login(process.env.DISCORD_TOKEN);require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create PostgreSQL connection pool
client.db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Load commands
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'src/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, 'src/events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Initialize database
client.db.query(`
  CREATE TABLE IF NOT EXISTS word_frequency (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL UNIQUE,
    count INTEGER DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_word ON word_frequency(word);
  CREATE INDEX IF NOT EXISTS idx_count ON word_frequency(count DESC);
  
  CREATE TABLE IF NOT EXISTS user_word_frequency (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    word VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word)
  );
  CREATE INDEX IF NOT EXISTS idx_user_word ON user_word_frequency(user_id, word);
`).then(() => console.log('Database ready')).catch(console.error);

// Login
client.login(process.env.DISCORD_TOKEN);
