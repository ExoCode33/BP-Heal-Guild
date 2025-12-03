module.exports = {
  name: 'userstats',
  description: 'Show another user\'s stats',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    if (!user) return message.reply('Usage: !userstats @user');
    
    const result = await client.db.query(
      'SELECT word, count, username FROM user_word_frequency WHERE user_id = $1 ORDER BY count DESC LIMIT 10',
      [user.id]
    );
    
    if (result.rows.length === 0) {
      return message.reply(`${user.username} hasn't said any tracked words yet!`);
    }
    
    let response = `**${result.rows[0].username}'s Top 10 Words:**\n\`\`\`\n`;
    result.rows.forEach((row, i) => {
      response += `${i + 1}. ${row.word}: ${row.count}\n`;
    });
    response += '```';
    message.reply(response);
  },
};
