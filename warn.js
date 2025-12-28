require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const bannedWords = [
  'amcık','orospu','sik','yarram','mal','salak','aptal','siktir',
  'ananı sikerim','sikerim','çük','meme','orospu evladı','orospu çocuğu',
  'bacını sikerim','allahını sikeyim','muhammedini','allahını','peygamberini'
];
const warnings = new Map();

client.once('ready', () => {
  console.log(`Bot hazır: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.member) return;

  const msgContent = message.content.toLowerCase();
  const foundWord = bannedWords.find(word => msgContent.includes(word));

  if (foundWord) {
    const userId = message.author.id;
    let count = warnings.get(userId) || 0;
    count++;
    warnings.set(userId, count);

    if (count < 3) {
      message.channel.send(`${count}x, Üslubunu Koru. ${message.author}`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
    } else {
      message.channel.send(`${count}x, 10 dakika boyunca susturuldun. ${message.author}`);

      if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        try {
          await message.member.timeout(10 * 60 * 1000, '3 uyarıdan dolayı timeout');
        } catch {
          // hata yoksay
        }
      }

      warnings.delete(userId);
    }
    return;
  }

  if (message.content.startsWith('!katil')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

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
