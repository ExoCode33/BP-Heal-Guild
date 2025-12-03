const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config/stopwords');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Scan channel history and log all words (Admin only)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to scan (defaults to current channel)')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of messages to scan (default: 1000, max: 10000)')
        .setMinValue(100)
        .setMaxValue(10000))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction, client) {
    // Check admin role
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (adminRoleId && !interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: '❌ You need the Admin role to use this command!', ephemeral: true });
    }

    await interaction.deferReply();

    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const limit = interaction.options.getInteger('limit') || 1000;

    try {
      let totalMessages = 0;
      let totalWords = 0;
      let lastId;
      const processedMessages = new Set();

      await interaction.editReply(`🔍 Scanning ${targetChannel.name}... This may take a while.`);

      // Fetch messages in batches
      while (totalMessages < limit) {
        const fetchOptions = { limit: Math.min(100, limit - totalMessages) };
        if (lastId) fetchOptions.before = lastId;

        const messages = await targetChannel.messages.fetch(fetchOptions);
        if (messages.size === 0) break;

        for (const message of messages.values()) {
          // Skip if already processed
          if (processedMessages.has(message.id)) continue;
          processedMessages.add(message.id);

          // Skip bots
          if (message.author.bot) continue;

          // Process words
          const words = message.content.split(/\s+/);
          for (const rawWord of words) {
            const word = rawWord.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
            
            if (word.length < 2 || !config.shouldTrack(word)) continue;

            try {
              // Global count
              await client.db.query(`
                INSERT INTO word_frequency (word, count, last_used) 
                VALUES ($1, 1, $2)
                ON CONFLICT (word) DO UPDATE SET 
                  count = word_frequency.count + 1,
                  last_used = GREATEST(word_frequency.last_used, $2)
              `, [word, message.createdAt]);
              
              // User count
              await client.db.query(`
                INSERT INTO user_word_frequency (user_id, username, word, count, last_used)
                VALUES ($1, $2, $3, 1, $4)
                ON CONFLICT (user_id, word) DO UPDATE SET
                  count = user_word_frequency.count + 1,
                  username = $2,
                  last_used = GREATEST(user_word_frequency.last_used, $4)
              `, [message.author.id, message.author.username, word, message.createdAt]);

              totalWords++;
            } catch (err) {
              console.error('Error tracking word:', err);
            }
          }

          totalMessages++;
        }

        lastId = messages.last().id;

        // Update progress every 100 messages
        if (totalMessages % 100 === 0) {
          await interaction.editReply(`🔍 Scanned ${totalMessages} messages, tracked ${totalWords} words...`);
        }
      }

      await interaction.editReply(
        `✅ **Scan Complete!**\n` +
        `📊 Scanned: ${totalMessages} messages\n` +
        `📝 Tracked: ${totalWords} words\n` +
        `📍 Channel: ${targetChannel.name}`
      );

    } catch (error) {
      console.error('Scan error:', error);
      await interaction.editReply('❌ Error scanning messages! Check bot permissions.');
    }
  },
};
