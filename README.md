
# **GitCord**  
A Discord bot for managing GitHub activity directly in your Discord server.

## **What It Does**  
GitCord connects a GitHub repository to a Discord server, creating channels and managing commits in real-time. When a repository is subscribed to:

- An `#all` channel is created for every commit and activity in the repository.
- Branch-specific channels are dynamically added and removed based on branch creation or deletion.
- Commit history and activities for each branch are posted in their respective channels.
- Unsubscribing removes all related channels and categories from the server.

## **Tech Stack**  

- **discord.js**: Used to create and manage the bot's functionality within Discord.
- **Express** & **Node.js**: Backend server to handle GitHub webhook payloads, parse the data, and trigger updates in Discord.
- **MongoDB**: Stores user configurations and subscription data to manage GitHub repository links and Discord servers.

## **How It Works**  

- **Webhooks**: GitCord leverages GitHub webhooks to receive commit and branch events. These webhooks trigger updates, which the bot processes and posts to relevant Discord channels.
- **Channel Management**: The bot dynamically manages channels:
  - An `#all` channel for overall repository activity.
  - Channels for each GitHub branch, created or deleted as needed.
- **Unsubscribe Feature**: When unsubscribing, GitCord removes all associated channels and categories, cleaning up the Discord server.

## **Challenges Solved**  

- **Payload Processing**: Initially, we tried a direct GitHub-to-Discord webhook connection but found it lacked the ability to parse necessary payloads (like branch details). To solve this, we hosted our own server to process the GitHub webhook data before sending it to Discord webhooks.
- **Dynamic Channel Management**: Handling the dynamic addition and deletion of channels based on GitHub branch events was a critical feature that involved efficiently managing Discord’s API.
