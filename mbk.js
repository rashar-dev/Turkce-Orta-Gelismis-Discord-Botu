require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`${client.user.tag} aktif!`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/g);
  const command = args.shift().slice(1).toLowerCase();
  const user = message.mentions.members.first();
  const reason = args.slice(1).join(" ") || "Belirtilmemiş";

  const embedBase = new EmbedBuilder()
    .setColor("#2f3136") // koyu gri - siyaha yakın
    .setAuthor({ name: "ReyderBOT", iconURL: client.user.displayAvatarURL() })
    .setTimestamp();

  // 🚫 BAN
  if (command === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("Ban yetkin yok.");

    try {
      await user.ban({ reason });
      const embed = EmbedBuilder.from(embedBase)
        .setDescription(`> ${user} sunucudan **yasaklandı!**`)
        .addFields({ name: "Sebep:", value: reason });
      message.channel.send({ embeds: [embed] });
    } catch {
      message.reply("Kullanıcıyı yasaklayamıyorum.");
    }
  }

  // 👢 KICK
  if (command === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("Kick yetkin yok.");

    try {
      await user.kick(reason);
      const embed = EmbedBuilder.from(embedBase)
        .setDescription(`> ${user} sunucudan **atıldı!**`)
        .addFields({ name: "Sebep:", value: reason });
      message.channel.send({ embeds: [embed] });
    } catch {
      message.reply("Kullanıcıyı atamıyorum.");
    }
  }

  // 🔇 MUTE (zamanlı)
  if (command === "mute") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("Mute yetkin yok.");

    const timeArg = args[0]; // süre
    const minutes = parseInt(timeArg);
    if (isNaN(minutes)) return message.reply("Lütfen dakika olarak süre gir.");

    const muteReason = args.slice(2).join(" ") || "Belirtilmemiş";
    const durationMs = minutes * 60 * 1000; // milisaniye dönüşümü

    try {
      await user.timeout(durationMs, muteReason);
      const embed = EmbedBuilder.from(embedBase)
        .setDescription(`> ${user} **${minutes} dakika boyunca susturuldu!**`)
        .addFields({ name: "Sebep:", value: muteReason });
      message.channel.send({ embeds: [embed] });
    } catch {
      message.reply("Kullanıcıyı susturamıyorum.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
