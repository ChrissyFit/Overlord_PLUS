const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: {
        name: 'info',
        description: 'Lists all Overlord bot commands.'
    },
    hasSubCommands: false,

    async execute(interaction, client) {
        await interaction.deferReply();

        const gengarFile = new AttachmentBuilder(path.join(__dirname, 'info-files/gengar.png'));
        const botAvatarURL = client.user.displayAvatarURL();


        // Creates the base Embed
        const infoEmbedBase = {
            title: 'Overlord PLUS',

            author: {
                name: '/info',
                icon_url: botAvatarURL,
                url: 'https://github.com/ChrissyFit/Overlord_PLUS',
            },

            color: 0x6b4683,

            url: 'https://github.com/ChrissyFit/Overlord_PLUS',
            description: 'A multipurpose personalized Discord bot meant to be used by my friends and I in my server.',

            thumbnail: {
                url: 'attachment://gengar.png',
            },

            timestamp: new Date().toISOString(),
            footer: {
                text: 'Remember that Overlord always watches...',
                icon_url: botAvatarURL,
            },
            fields: [
                //Empty field
                {
                    name: '',
                    value: '',
                },

                {
                    name: 'Commands {/}:',
                    value: '',
                },
            ],
        };


        // Creates the URL Button
        const urlButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('GitHub Repo')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/ChrissyFit/Overlord_PLUS')
            );
            

        // Fetches every command along with their subCommands
        // and attaches them to the Embed.
        const foldersPath = path.join(__dirname, '..');
        const commandFolders = fs.readdirSync(foldersPath);
        let infoEmbed = new EmbedBuilder(infoEmbedBase);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                
                if (command.hasSubCommands) {
                    for (const subCommand of command.data.options) {
                        infoEmbed.addFields(
                            { name: `• ${command.data.name} ${subCommand.name}:`,
                            value: `    ${subCommand.description}`,}
                            );
                    }
                } else {
                    infoEmbed.addFields(
                    { name: `• ${command.data.name}:`,
                    value: `    ${command.data.description}`,}
                    );
                }
            }
        }
        infoEmbed.addFields({ name: ' ', value: ' ', });
            
        interaction.editReply({ embeds: [infoEmbed], components: [urlButton], files: [gengarFile] });
    }
}