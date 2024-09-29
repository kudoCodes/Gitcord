const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { findWebhook, addValues, findGuildId } = require("../../index.js");

// Array of colors from your logo for the gradient effect
const colors = ['#FF7F50', '#87CEEB', '#FF69B4', '#FFD700', '#ADFF2F']; // Customize these as per your logo

const commandData = new SlashCommandBuilder()
    .setName('sub')
    .setDescription("acknowledges your existence")
    .addStringOption(option =>
        option.setName('reponame')
            .setDescription('Create category for your GitHub')
            .setMinLength(1)
            .setMaxLength(25)
            .setRequired(true));

let allChannel; // Declare allChannel here to export it later
let webhookUrl; // Declare webhookUrl here to export it later
let repoName; // Declare repoName here to export it later
async function execute(interaction) {
    try {
        repoName = interaction.options.getString('reponame');
        // Check if the webhook already exists
        webhookUrl = await findWebhook(repoName);
        if (webhookUrl) {
            await interaction.reply(`Webhook already exists for ${repoName}`);
            return;
        }
        // Create the category
        const category = await interaction.guild.channels.create({
            name: repoName,
            type: ChannelType.GuildCategory,
        });

        // Create the text channel inside the category
        
        allChannel = await interaction.guild.channels.create({
            name: 'all',
            type: ChannelType.GuildText,
            parent: category,
        });

        await interaction.reply(`Repo ${repoName} created`);

        // Create the webhook in the text channel
        const webhook = await allChannel.createWebhook({
            name: 'GitCord', // Webhook name
            reason: 'Webhook for GitHub integration', // Reason for creating the webhook
        });
        
        // Construct the webhook URL
        webhookUrl = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;
        console.log(`Webhook created! URL: ${webhookUrl}`);

        // Add the webhook to the database
        await addValues(repoName, webhookUrl, interaction.guild.id);

        // Randomly select a color from the array for the embed
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Create the embed with the randomly selected color
        const embed = new EmbedBuilder()
            .setColor(randomColor) // Set the embed color
            .setTitle(`GitCord Webhook Created`)
            .setDescription(`Add Webhook URL on your GitHub repo for integration: ${webhookUrl}`)
            .addFields({ name: 'Instructions:', value: 'Ensure Content Type is application/json in your GitHub webhook settings.' })
            .setFooter({ text: 'GitCord - Stay Connected with GitHub on Discord!' })
            .setTimestamp();

        // Send the embed to the channel
        await allChannel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Error creating webhook:', error);
        await interaction.reply('Failed to create the webhook. Please try again.');
    }
}

function getAllChannel() {
    return allChannel;
}

function getWebhookUrl() {
    return webhookUrl;
}

function getRepoName(){
    return repoName;
}
// Export the command data, execute function, and allChannel object
exports.data = commandData;
exports.execute = execute;
exports.getAllChannel = getAllChannel;
exports.getWebhookUrl = getWebhookUrl;
exports.getRepoName = getRepoName;