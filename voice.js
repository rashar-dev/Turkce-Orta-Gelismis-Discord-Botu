require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once('ready', () => {
  console.log(`Bot hazır: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild) return;

  if (message.content.startsWith('!katil')) {
    if (!message.member.permissions.has('Administrator')) return;

    const args = message.content.split(' ').slice(1);
    let channelId;

    if (args.length > 0 && args[0]) {
      channelId = args[0];
    } else {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return;
      channelId = voiceChannel.id;
    }

    const channel = message.guild.channels.cache.get(channelId);
    if (!channel || channel.type !== 2) return;

    joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    message.react('✅').catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
