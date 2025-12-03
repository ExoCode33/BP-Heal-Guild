const config = require('../../config/stopwords');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Ignore bots
    if (message.author.bot) return;
    
    // Track words
    const words = message.content.split(/\s+/);
    for (const rawWord of words) {
      const word = rawWord.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
      
      // Filter
      if (word.length < 2 || !config.shouldTrack(word)) continue;
      
      try {
        // Global count
        await client.db.query(`
          INSERT INTO word_frequency (word, count, last_used) 
          VALUES ($1, 1, CURRENT_TIMESTAMP)
          ON CONFLICT (word) DO UPDATE SET 
            count = word_frequency.count + 1,
            last_used = CURRENT_TIMESTAMP
        `, [word]);
        
        // User count
        await client.db.query(`
          INSERT INTO user_word_frequency (user_id, username, word, count, last_used)
          VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id, word) DO UPDATE SET
            count = user_word_frequency.count + 1,
            username = $2,
            last_used = CURRENT_TIMESTAMP
        `, [message.author.id, message.author.username, word]);
      } catch (err) {
        console.error('Track error:', err);
      }
    }
  },
};
