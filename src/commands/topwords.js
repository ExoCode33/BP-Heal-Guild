module.exports = {
  name: 'topwords',
  description: 'Show most used words',
  async execute(message, args, client) {
    const limit = Math.min(parseInt(args[0]) || 10, 50);
    const result = await client.db.query(
      'SELECT word, count FROM word_frequency ORDER BY count DESC LIMIT $1',
      [limit]
    );
    
    if (result.rows.length === 0) {
      return message.reply('No words tracked yet!');
    }
    
    let response = `**Top ${result.rows.length} Words:**\n\`\`\`\n`;
    result.rows.forEach((row, i) => {
      response += `${i + 1}. ${row.word}: ${row.count}\n`;
    });
    response += '```';
    message.reply(response);
  },
};
