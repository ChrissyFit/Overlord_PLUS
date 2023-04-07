require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const eventHandler = require('./handlers/event-handler.js')

const { Client, IntentsBitField, Partials, MessageAttachment, Collection } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent
    ],
    partials: [
        Partials.Channel // For DMs
    ]
});

client.commands = new Collection();

// Searches through commands directory for commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command && 'hasSubCommands' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required property.`);
        }
    }
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        eventHandler(client);

        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(error);
    }
})();