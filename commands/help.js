const botConfig = require('../data/botConfig.json');

module.exports.run = async (client, message, args) => {

    try {

        var prefix = botConfig.prefix

        var response = "**Bot commands**\r\n\n";
        var general = "**__Algemene commands__**\r\n";
        var info = "\n**__Staff__**\r\n";
        var slash = "\n**__Slash__**(momenteel enigste command(help)\r\n";



        client.commands.forEach(command => {

            switch (command.help.category) {
                case "general":
                    general += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;
                case "info":
                    info += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;
                case "slash":
                    slash += `/${command.slashHelp.name} - ${command.slashHelp.description}\r\n`;
                    break;
            }



        });

        response += general + info + slash;

        message.reply(response)

    } catch (error) {
        message.reply('Er is iets misgelopen.')
    }

}

module.exports.help = {
    name: "help",
    category: "general",
    description: "Geef dit menu weer."
}