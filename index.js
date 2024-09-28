// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, allChannelID } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once).
client.once('ready', async () => {
    console.log('Bot is online!');
});


// Log in to Discord with your client's token
client.login(token);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command)
	{
		console.error("No command matching " + interaction.commandName +  " was found");
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "there was an error while exec this command :(", ephemeral: true});
		} else {
			await interaction.reply({ content: "there was an error while exec this command :(", ephemeral: true});

		}
	}
});


const { getAllChannel } = require('./commands/utility/sub.js');

client.on(Events.MessageCreate, async message => {
	// Define the specific channel ID


	// UNCOMMENT THIS WHEN TIME TO DEMO


	// const allChannel = getAllChannel();
	// if (!allChannel)
	// {
	// 	console.error("allChannel is not defined");
	// 	return;
	// }

	// const specificChannelId = allChannel.id;

	// COMMENT THIS OUT WHEN TIME TO DEMO
	specificChannelId = allChannelID;


	if (message.channel.id !== specificChannelId) return;
	
	console.log(message);
});