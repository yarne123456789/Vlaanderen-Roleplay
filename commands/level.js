const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js')

module.exports.run = async (client, message, args) => {

    var levelFile = JSON.parse(fs.readFileSync('./data/levels.json'));

    var userID = message.member.id;

    try {

        var nextLevelXP = levelFile[userID].level * 300;

        if (nextLevelXP == 0) nextLevelXP == 100;

        const rank = new canvacord.Rank()
            .setAvatar(message.member.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(levelFile[userID].xp)
            .setLevel(levelFile[userID].level)
            .setRequiredXP(nextLevelXP)
            .setProgressBar("#FFA500", "COLOR")
            .setUsername(message.member.username)
            .setDiscriminator(message.member.discriminator);
        console.log(userID)
        rank.build().then(data => {
            const attachment = new MessageAttachment(data, "RankCard.png");
            message.reply({ files: [attachment] });
        })


    } catch (err) {
        console.log(userID)
        message.reply({ content: 'Geen gegevens gevonden.' });
    }





}

module.exports.help = {
    name: "level",
    category: "general",
    description: "Geef je level weer."
}
