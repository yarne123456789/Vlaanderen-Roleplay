const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('Je hebt geen permissie om dit commando uit te voeren!');

    if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.reply('Ik heb geen permissie om mensen te kicken.');

    if (!args[0]) return message.reply('Je moet een gebruiker opgeven.');

    if (!args[1]) return message.reply('Je moet een reden opgeven.');

    var kickUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id)

    if (!kickUser) return message.reply('Ik kan het opgegeven member niet vinden.');

    var reason = args.slice(1).join(" ");

    var embedPromt = new discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Gelieve te reageren binnen 30 seconden.')
        .setDescription(`Wil je ${kickUser} kicken?`);
    var embed = new discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`**Gekickt:** ${kickUser} (${kickUser.id})
    **Gekickt door:** ${message.author}
    **reden:** ${reason}`)
        .setFooter(message.member.displayName)
        .setTimestamp();

    message.channel.send({ embeds: [embedPromt] }).then(async msg => {

        let authorID = message.author.id;
        let time = 30;
        let reactions = ["✅", "❌"];

        // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
        time *= 1000;

        // We gaan iedere reactie meegegeven onder de reactie en deze daar plaatsen.
        for (const reaction of reactions) {
            await msg.react(reaction);
        }

        // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
        // dan kunnen we een bericht terug sturen.
        const filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id === authorID;
        };

        // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
        // Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
        msg.awaitReactions({ filter, max: 1, time: time }).then(collected => {
            var emojiDetails = collected.first();

            if (emojiDetails.emoji.name === "✅") {

                msg.delete();

                kickUser.kick(reason).catch(err => {
                    if (err) return console.log(err)
                });

                message.channel.send({ embeds: [embed] })

            } else if (emojiDetails.emoji.name === "❌") {

                msg.delete();

                message.channel.send('Kick geanulleerd.').then(msg => {
                    message.delete()
                    setTimeout(() => msg.delete(), 5000);
                });

            }

        });
    });

}

module.exports.help = {
    name: "kick",
    category: "info",
    description: "Kick [naam] [reden]"
}