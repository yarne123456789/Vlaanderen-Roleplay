
const discord = require('discord.js');
module.exports.run = async(client,message,args) => {
    
    var botEmbed = new discord.MessageEmbed()
         .setTitle('tittle test')
        .setDescription('discriptie test')
        .setColor('BLUE')
        .addFields(
        {name:"Bot naam:", value:client.user.username, inline:true});

    return message.channel.send({embeds:[botEmbed]});
        

}

module.exports.help = {
    name:"infotest",
    category:"general",
    description:"TEST"
}