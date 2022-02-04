const { Intents, Client, Collection, MessageEmbed } = require('discord.js');
const botConfig = require('./data/botConfig.json');
const LevelFile = require('./data/levels.json');

const fs = require("fs");

const { REST } = require('@discordjs/rest');
const { Routes, EmbedType } = require('discord-api-types/v9');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const token = "OTE2Nzk2OTYyMjk1MTQ0NDg4.YavXtQ.96fvXAvCXjBacwaqxxSFcxGf7yw"//process.env.token
client.commands = new Collection();
client.slashCommands = new Collection();
const slashCommands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

	const command = require(`./commands/${file}`);

	client.commands.set(command.help.name, command);

	console.log(`De file ${command.help.name}.js is succesvol ingeladen!`);

}

const commandSlashFiles = fs.readdirSync('./SlashCommands').filter(file => file.endsWith('.js'));

for (const fileSlash of commandSlashFiles) {

	const commandSlash = require(`./SlashCommands/${fileSlash}`);

	client.slashCommands.set(commandSlash.data.name, commandSlash);
	slashCommands.push(commandSlash.data.toJSON());

	console.log(`De file ${commandSlash.data.name}.js is succesvol ingeladen!`);

}


client.once("ready", () => {
	console.log(`${client.user.username} is succesvol online!`);

	let guildId = "881280822387281960";

	let clientId = "916796962295144488";

	const rest = new REST({ version: '9' }).setToken(token);//process.env.token

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: slashCommands },
			);

			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	})();

});

client.on('interactionCreate', async interaction => {
	if (interaction.isSelectMenu()) {
		const { customId, values, member } = interaction;
		return
	} else if (interaction.isCommand()) {

		const slashCommand = client.slashCommands.get(interaction.commandName);
		if (!slashCommand) return;

		try {

			await slashCommand.execute(client, interaction);

		} catch (err) {
			await interaction.reply({ content: "Er liep iets mis.", ephemeral: true });
		}

	}
})

client.on('messageCreate', async message => {

	if (message.author.bot) return;

	var prefix = botConfig.prefix;

	var messageArray = message.content.split(" ");

	var command = messageArray[0];

	if (!message.content.startsWith(prefix)) {
		RandomXP(message);

	}

	const commandData = client.commands.get(command.slice(prefix.length));

	if (!commandData) return;

	var arguments = messageArray.slice(1);

	try {

		commandData.run(client, message, arguments);

	} catch (error) {
		console.log(error),
			await message.reply("Er was een error tijden het uitvoeren van deze command.");
	}

});

function RandomXP(message) {

	var randomXP = Math.floor(Math.random() * 15) + 1;

	

	var iduser = message.author.id;

	if (!LevelFile[iduser]) {

		LevelFile[iduser] = {
			xp: 0,
			level: 0
		}

	}

	LevelFile[iduser].xp += randomXP;

	var levelUser = LevelFile[iduser].level;
	var xpUser = LevelFile[iduser].xp;
	var nextLevelXp = levelUser * 300;

	if (nextLevelXp == 0) nextLevelXp = 100;
	if (xpUser >= nextLevelXp) {

		LevelFile[iduser].level += 1;

		fs.writeFile('./data/levels.json', JSON.stringify(LevelFile),
			err => {
				if (err) return console.log('Er ging iets fout bij het level systeem.');
			});
		var embedLevel = new MessageEmbed()
		.setDescription(`***NIEUW LEVEL*** ${message.member.displayName}`)
		.setColor('#00FF00')
		.addField("Nieuw level:", LevelFile[iduser].level.toString());

		message.channel.send({embeds: [embedLevel]})

	}

}
client.login(token);//process.env.token