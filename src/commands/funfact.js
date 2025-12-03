const { EmbedBuilder } = require('discord.js');

const factGenerators = {
  async topWord(db) {
    const result = await db.query('SELECT word, count FROM word_frequency ORDER BY count DESC LIMIT 1');
    if (!result.rows[0]) return null;
    return {
      title: '🏆 Most Popular Word',
      description: `The word "**${result.rows[0].word}**" has been said **${result.rows[0].count}** times!`,
      color: 0xFFD700
    };
  },
  
  async userChampion(db) {
    const result = await db.query('SELECT username, word, count FROM user_word_frequency ORDER BY count DESC LIMIT 1');
    if (!result.rows[0]) return null;
    return {
      title: '🎯 Word Champion',
      description: `**${result.rows[0].username}** has said "**${result.rows[0].word}**" **${result.rows[0].count}** times!`,
      color: 0x00FF00
    };
  },
  
  async trending(db) {
    const result = await db.query(`
      SELECT word FROM word_frequency 
      WHERE last_used > NOW() - INTERVAL '24 hours' 
      ORDER BY count DESC LIMIT 3
    `);
    if (result.rows.length === 0) return null;
    const words = result.rows.map(r => `"${r.word}"`).join(', ');
    return {
      title: '📈 Trending Words (24h)',
      description: `The hottest words today: ${words}`,
      color: 0xFF6B6B
    };
  },
  
  async total(db) {
    const result = await db.query('SELECT COUNT(DISTINCT word) as words, SUM(count) as total FROM word_frequency');
    return {
      title: '📊 Server Statistics',
      description: `This server has used **${result.rows[0].words}** unique words for **${result.rows[0].total}** total uses!`,
      color: 0x4A90E2
    };
  }
};

module.exports = {
  name: 'funfact',
  description: 'Get a random fun fact',
  async execute(message, args, client) {
    const fact = await this.getRandom(client.db);
    if (!fact) return message.reply('No data yet!');
    
    const embed = new EmbedBuilder()
      .setTitle(fact.title)
      .setDescription(fact.description)
      .setColor(fact.color)
      .setFooter({ text: '💡 Fun Fact' })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
  
  async getRandom(db) {
    const types = Object.keys(factGenerators);
    const type = types[Math.floor(Math.random() * types.length)];
    return await factGenerators[type](db);
  },
  
  async postRandom(client) {
    const channelId = process.env.FUN_FACT_CHANNEL_ID;
    if (!channelId) return;
    
    try {
      const channel = await client.channels.fetch(channelId);
      const fact = await this.getRandom(client.db);
      if (!fact) return;
      
      const embed = new EmbedBuilder()
        .setTitle(fact.title)
        .setDescription(fact.description)
        .setColor(fact.color)
        .setFooter({ text: '💡 Fun Fact' })
        .setTimestamp();
      
      await channel.send({ embeds: [embed] });
      console.log('📤 Posted fun fact');
    } catch (err) {
      console.error('Fun fact error:', err);
    }
  }
};
