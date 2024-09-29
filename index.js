// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, allChannelID } = require('./config.json');


const app = express();
const port = 3000;

// Parse incoming GitHub payloads as JSON
app.use(bodyParser.json());

app.post('/github', async (req, res) => {
    const payload = req.body;

    console.log('GitHub webhook payload received:');
    console.log(JSON.stringify(payload, null, 2)); // Logs the entire payload for inspection

    // Extract relevant information from the GitHub payload
    const { pusher, repository, ref, head_commit } = payload;
    const branch = ref.split('/').pop(); // Get branch name
    const commitMessage = head_commit.message;
    const author = pusher.name;

    // Construct a message for Discord
    const discordEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle(`New Push to ${repository.name}`)
        .setDescription(`Branch: ${branch}\nAuthor: ${author}\nMessage: ${commitMessage}`)
        .setFooter({ text: 'GitHub -> Discord Integration' })
        .setTimestamp();

    // Forward the message to the Discord webhook
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1289738600828764271/oorb89Z6Gx7xU_bjrBTnA8bFQQk4McOkyK7Klv5qRhTMxNv_GHpDpwhznhUc1Axe2jG4';

    try {
        await axios.post(discordWebhookUrl, {
            embeds: [discordEmbed.toJSON()]
        });
        console.log('Message sent to Discord!');
        res.status(200).send('Webhook received and message sent to Discord!');
    } catch (error) {
        console.error('Error sending message to Discord:', error);
        res.status(500).send('Failed to send message to Discord');
    }
});

app.listen(port, () => {
    console.log(`GitHub webhook listener running on port ${port}`);
});

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