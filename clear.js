require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once('ready', () => {
  console.log(`Bot hazır: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;

  if (message.content.startsWith('!temizle')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

    const args = message.content.split(' ').slice(1);
    const miktar = parseInt(args[0]);
    if (isNaN(miktar) || miktar < 1 || miktar > 100) return;

    try {
      const silinen = await message.channel.bulkDelete(miktar, true);
      message.channel.send(`Başarıyla \`${silinen.size}\` adet mesaj silindi.`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
