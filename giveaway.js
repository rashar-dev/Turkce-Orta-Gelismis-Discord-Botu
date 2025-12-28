const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, Routes } = require('discord.js')
const { REST } = require('@discordjs/rest')
require('dotenv').config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Reaction]
})

const token = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID

const commands = [
  new SlashCommandBuilder()
    .setName('cekilis')
    .setDescription('Çekiliş başlat')
    .addStringOption(option =>
      option.setName('isim')
        .setDescription('Çekiliş ismi')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('sure')
        .setDescription('Süre (dakika)')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('kazanan')
        .setDescription('Kaç kazanan olacak')
        .setRequired(true))
].map(cmd => cmd.toJSON())

const rest = new REST({ version: '10' }).setToken(token)

;(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    )
    console.log('Slash komutları yüklendi')
  } catch (error) {
    console.error('Komut yüklenirken hata:', error)
  }
})()

client.on('ready', () => {
  console.log(`${client.user.tag} aktif`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'cekilis') {
    const isim = interaction.options.getString('isim')
    const sure = interaction.options.getInteger('sure')
    const kazanan = interaction.options.getInteger('kazanan')

    const mesaj = await interaction.reply({ content: `🎁 **${isim}** çekilişi başladı! Katılmak için tepkiye tıkla. 
**Süre:** ${sure} dakika, 
**Kazanan sayısı:**${kazanan}`, fetchReply: true })
    await mesaj.react('🎉')

    setTimeout(async () => {
      const msg = await interaction.channel.messages.fetch(mesaj.id)
      const reaction = msg.reactions.cache.get('🎉')
      if (!reaction) return interaction.followUp('Kimse katılmadı.')

      const users = await reaction.users.fetch()
      const katilimcilar = users.filter(u => !u.bot).map(u => u.id)
      if (katilimcilar.length === 0) return interaction.followUp('Kimse katılmadı.')

      if (katilimcilar.length < kazanan) return interaction.followUp(`Katılımcı sayısı yetersiz: ${katilimcilar.length}`)

      const secilenler = katilimcilar.sort(() => 0.5 - Math.random()).slice(0, kazanan)
      interaction.followUp(`🎁 **${isim}** çekilişi bitti! Kazananlar: ${secilenler.map(id => `<@${id}>`).join(', ')}`)
    }, sure * 60000)
  }
})

client.login(token)
