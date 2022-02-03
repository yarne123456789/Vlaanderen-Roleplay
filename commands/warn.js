const fs = require('fs')
const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('881282376200765491')) return message.reply('Je hebt geen permissie om dit commando uit te voeren!');

    if (!args[0]) return message.reply('Je moet een gebruiker opgeven.');

    if (!args[1]) return message.reply('Je moet een reden opgeven.');

    var warnUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id)

    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply('Kan de gebruiker niet vinden.');

    if (warnUser.roles.cache.has('881282376200765491')) return message.reply('Je kan geen staffleden warnen.')

    const warns = JSON.parse(fs.readFileSync("./data/warnings.json", "UTF8"));

    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    }



    warns[warnUser.id].warns++;

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**Gewarnd:** ${warnUser.user.username} (${warnUser.id})
            **Warning door:** ${message.author}
            **Redenen: ** ${reason}`)
        .addField("Aantal warns", warns[warnUser.id].warns.toString());

    const channel = message.member.guild.channels.cache.get('927645918969352202');

    if (!channel) return;

    channel.send({ embeds: [embed] });

    fs.writeFile('./data/warnings.json', JSON.stringify(warns), (err)=> {
        if(err) console.log(err);
    })
}

module.exports.help = {
    name: "warn",
    category: "info",
    description: "warn [mention/tagg/persoon] [reden]."
}