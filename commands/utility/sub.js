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
    },
};