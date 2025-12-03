module.exports = {
  name: 'mystats',
  description: 'Show your personal stats',
  async execute(message, args, client) {
    const result = await client.db.query(
      'SELECT word, count FROM user_word_frequency WHERE user_id = $1 ORDER BY count DESC LIMIT 10',
      [message.author.id]
    );
    
    if (result.rows.length === 0) {
      return message.reply('You haven\'t said any tracked words yet!');
    }
    
    let response = `**Your Top 10 Words:**\n\`\`\`\n`;
    result.rows.forEach((row, i) => {
      response += `${i + 1}. ${row.word}: ${row.count}\n`;
    });
    response += '```';
    message.reply(response);
  },
};
