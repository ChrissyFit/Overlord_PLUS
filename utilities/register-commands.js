require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];

// Searches through commands directory for commands
const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.data);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Registering ${commands.length} slash commands...`);

        // Guild Commands
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, process.env.GUILD_ID
                ),
            { body: commands},
        )

        // Global Commands
        // Note: Will create dupe in guilds but it is the only way to be used in DMs
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID
                ),
            { body: commands},
        )

        console.log('Slash comamnds registered!')
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();