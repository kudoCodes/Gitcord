const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sub')
        .setDescription("acknowleges your existence")
        .addStringOption(option =>
            option.setName('repolink')
                .setDescription('The input to echo back')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply(interaction.options.getString('repolink'));
    },
};