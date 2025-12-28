const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
})

const channelTimes = new Map()

client.on('ready', () => {
  console.log(`${client.user.tag} aktif`)
})

client.on('voiceStateUpdate', (oldState, newState) => {
  const userId = newState.id
  const guild = newState.guild
  const member = guild.members.cache.get(userId)

  const joinedChannel = newState.channel
  const leftChannel = oldState.channel

  if (joinedChannel && (!leftChannel || joinedChannel.id !== leftChannel.id)) {
    channelTimes.set(userId, {
      joinedAt: Date.now(),
      channelId: joinedChannel.id,
      channelName: joinedChannel.name
    })
  }

  if ((!joinedChannel && leftChannel) || (joinedChannel && leftChannel && joinedChannel.id !== leftChannel.id)) {
    const data = channelTimes.get(userId)
    if (!data) return

    const now = Date.now()
    const diffMs = now - data.joinedAt

    const totalSeconds = Math.floor(diffMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const joinDate = new Date(data.joinedAt)
    const formattedDate = joinDate.toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    let süre = ''
    if (hours > 0) süre += `**${hours} saat** `
    if (minutes > 0) süre += `**${minutes} dakika** `
    süre += `**${seconds} saniye**`

    member.send(
      `**${guild.name}** sunucusunda\n<#${data.channelId}> kanalında\n${süre} kaldın.\nBu kanala **${formattedDate}** tarihinde giriş yapmıştın.`
    )

    channelTimes.delete(userId)

    if (joinedChannel) {
      channelTimes.set(userId, {
        joinedAt: Date.now(),
        channelId: joinedChannel.id,
        channelName: joinedChannel.name
      })
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
