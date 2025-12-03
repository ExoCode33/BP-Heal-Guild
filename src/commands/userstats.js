const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userstats')
    .setDescription('Show another user\'s word stats')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check')
        .setRequired(true)),
  
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    
    const result = await client.db.query(
      'SELECT word, count, username FROM user_word_frequency WHERE user_id = $1 ORDER BY count DESC LIMIT 10',
      [user.id]
    );
    
    if (result.rows.length === 0) {
      return interaction.reply(`${user.username} hasn't said any tracked words yet!`);
    }
    
    let response = `**${result.rows[0].username}'s Top 10 Words:**\n\`\`\`\n`;
    result.rows.forEach((row, i) => {
      response += `${i + 1}. ${row.word}: ${row.count}\n`;
    });
    response += '```';
    
    await interaction.reply(response);
  },
};
