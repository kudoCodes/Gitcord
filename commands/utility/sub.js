const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sub')
        .setDescription("acknowleges your existence")
        .addStringOption(option =>
            option.setName('reponame')
                .setDescription('create category for your github')
                .setMinLength(1)
                .setMaxLength(25)
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('reponame');
        const category = await interaction.guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory,
        });
        const allChannel = await interaction.guild.channels.create({
            name: 'all',
            type: ChannelType.GuildText,
            parent: category
        })
        await allChannel.send(`Init repo ${name}, channel ID is ${allChannel.id}`);
        await interaction.reply(`Repo ${name} created`)

        const webhook = await allChannel.createWebhook({
            name: 'GitCord Webhook', // Webhook name
            reason: 'Webhook for GitHub integration' // Reason for creating the webhook
        });
    
        // Construct the webhook URL
        const webhookUrl = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;
        console.log(`Webhook created! URL: ${webhookUrl}`);
    
        // Optionally, send the URL in a Discord message
        await allChannel.send(`Webhook URL for GitHub integration: ${webhookUrl}`);
    },
};