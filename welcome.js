require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
})

const WELCOME_CHANNEL_ID = '1426973102570733789'

client.once('ready', () => {
  console.log(`${client.user.tag} aktif`)
})

client.on('guildMemberAdd', async (member) => {
  const kanal = member.guild.channels.cache.get(WELCOME_CHANNEL_ID)
  if (!kanal) return

  kanal.send(`Hoş Geldin <@${member.id}>, sunucumuz seninle \`${member.guild.memberCount}\` oldu :tada:`)
})

client.on('guildMemberRemove', async (member) => {
  const kanal = member.guild.channels.cache.get(WELCOME_CHANNEL_ID)
  if (!kanal) return

  kanal.send(`Hoşça Kal <@${member.id}>, sunucumuzdaki kalan üye sayısı \`${member.guild.memberCount}\` oldu :wave:`)
})

client.login(process.env.DISCORD_TOKEN)