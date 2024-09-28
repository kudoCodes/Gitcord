// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once).
client.once('ready', async () => {
    console.log('Bot is online!');

    try {
        // Fetch the specific channel where you want to create the webhook
        const channel = await client.channels.fetch('1289620066333360249');

        // Create the webhook
        const webhook = await channel.createWebhook({
            name: 'GitCord Webhook', // Webhook name
            reason: 'Webhook for GitHub integration' // Reason for creating the webhook
        });

        // Construct the webhook URL
        const webhookUrl = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}/github`;
        console.log(`Webhook created! URL: ${webhookUrl}`);

        // Optionally, send the URL in a Discord message
        await channel.send(`Webhook URL for GitHub integration: ${webhookUrl}`);

    } catch (error) {
        console.error('Error creating webhook:', error);
    }
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