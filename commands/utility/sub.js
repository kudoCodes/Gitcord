const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sub')
        .setDescription("acknowleges your existence"),
    async execute(interaction) {
        await interaction.reply('gloobert!');
    },
};
