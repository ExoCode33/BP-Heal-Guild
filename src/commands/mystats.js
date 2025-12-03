const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mystats')
    .setDescription('Show your personal word stats'),
  
  async execute(interaction, client) {
    const result = await client.db.query(
      'SELECT word, count FROM user_word_frequency WHERE user_id = $1 ORDER BY count DESC LIMIT 10',
      [interaction.user.id]
    );
    
    if (result.rows.length === 0) {
      return interaction.reply('You haven\'t said any tracked words yet!');
    }
    
    let response = `**Your Top 10 Words:**\n\`\`\`\n`;
    result.rows.forEach((row, i) => {
      response += `${i + 1}. ${row.word}: ${row.count}\n`;
    });
    response += '```';
    
    await interaction.reply(response);
  },
};
