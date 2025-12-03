const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topwords')
    .setDescription('Show most used words')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of words to show (1-50)')
        .setMinValue(1)
        .setMaxValue(50)),
  
  async execute(interaction, client) {
    const limit = interaction.options.getInteger('limit') || 10;
    
    const result = await client.db.query(
      'SELECT word, count FROM word_frequency ORDER BY count DESC LIMIT $1',
      [limit]
    );
    
    if (result.rows.length === 0) {
      return interaction.reply('No words tracked yet!');
    }
    
    let response = `**Top ${result.rows.length} Words:**\n\`\`\`\n`;
    result.rows.forEach((row, i) => {
      response += `${i + 1}. ${row.word}: ${row.count}\n`;
    });
    response += '```';
    
    await interaction.reply(response);
  },
};
