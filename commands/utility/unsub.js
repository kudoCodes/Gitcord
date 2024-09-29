const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { deleteRepo } = require("../../index.js");

const commandData = new SlashCommandBuilder()
  .setName('unsub')
  .setDescription('Unsubscribes from GitHub, removes all associated text channels and categories')
  .addStringOption(option =>
    option.setName('reponame')  // Lowercase option name
      .setDescription('The name of the repository')
      .setMinLength(1)
      .setMaxLength(25)
      .setRequired(true));

let repoName;

async function execute(interaction) {
  // Get the repoName from the interaction options
  repoName = interaction.options.getString('reponame').toLowerCase();

  // Fetch all categories from the guild (server)
  const categories = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory);

  // Look for the category that matches the repoName (case-insensitive)
  const category = categories.find(cat => cat.name.toLowerCase() === repoName);

  if (!category) {
    await interaction.reply(`No category found for repository: ${repoName}`);
    return;
  }

  // Get all channels that belong to this category
  const channels = interaction.guild.channels.cache.filter(channel => channel.parentId === category.id);

  // Delete all channels in the category
  if (channels.size > 0) {
    await Promise.all(channels.map(channel => channel.delete()));
  }

  // After deleting the channels, delete the category
  await category.delete();

  // Send a single message to the user after all operations
  await interaction.reply(`Github repository '${category.name}' has been removed from the server.`);

  await deleteRepo(category.name);
}

// Export the command data and execute function
exports.data = commandData;
exports.execute = execute;
