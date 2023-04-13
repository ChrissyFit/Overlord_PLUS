const { Client, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder  } = require('discord.js');
const path = require('path');
const fs = require('fs');
const Log = require('/home/ChrissyFit_PI/Projects/Overlord_Bot/commands/utility/game-log-files/Log.js');

module.exports = {
    data: {
        name: 'game-log',
        description: 'Logs or removes a completed game from user database.',
        // Subcommands
        options: [
            {
                name: 'add',
                description: 'Adds a completed game to database.',
                options: [
                    {
                        name: 'game',
                        description: 'Enter game title.',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: 'date',
                        description: 'Enter the game completion date <YYYY-MM-DD>',
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    },
                ],
                type: 1, // Subcommand type
            },
            {
                name: 'remove',
                description: 'Removes completed game from database.',
                options: [
                    {
                        name: 'game',
                        description: 'Enter game title.',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
                type: 1, // Subcommand type
            },
            {
                name: 'list',
                description: 'List all your logged games.',
                options: [
                    {
                        name: 'mention',
                        description: 'Member in the server.',
                        type: ApplicationCommandOptionType.User,
                        required: false,
                    },
                ],
                type: 1, // Subcommand type
            },
        ],
        
    },
    hasSubCommands: true,

    async execute(interaction, client) {
        await interaction.deferReply();

        const subcommand = interaction.options._subcommand;
        const game = interaction.options.get('game')?.value;
        const inputDate = interaction.options.get('date')?.value;
        const mention = interaction.options.get('mention')?.value || interaction.user.id;

        // Fetches the user specific query
        const query = {
            userID: mention,
        };
        const logger = await Log.findOne(query);


        if (subcommand === 'add') {
            try {
                if (logger) {
                    
                    const gameIndex = logger?.games.findIndex(function (g) {
                        return g.name === game
                    })+1 || -1;

                    const guildIndex = logger?.guilds.findIndex(function (g) {
                        return g.guildID === interaction.guild?.id
                    })+1 || -1;

                    if (gameIndex !== -1) {
                        interaction.editReply(`**${game}** already exist in your game log!`);
                        return;
                    }
                    logger.games.push({ name: game, date: inputDate });

                    if (interaction.guild && guildIndex === -1) {
                        logger.guilds.push({ guildID: interaction.guild.id });
                    }

                    await logger.save().catch((e) => {
                        console.log(e);
                        return;
                    });
                }

                // if (!logger)
                else {
                    const newLogger = new Log({
                        userID: interaction.user.id,
                        games: [{ name: game }],
                    });
                    if (interaction.guild) {
                        newLogger.guilds.push({ guildID: interaction.guild.id })
                    }

                    await newLogger.save().catch((e) => {
                        console.log(e);
                        return;
                    });
                }

                interaction.editReply(`**${game}** successfully added to your game log.`);
            } catch (error) {
                console.log(error);
            }
        }


        if (subcommand === 'remove') { 
            try {
                if (!logger) {
                    const newLogger = new Log({ userID: interaction.user.id });

                    await newLogger.save().catch((e) => {
                        console.log(e);
                        return;
                    });
                }

                const index = logger?.games.findIndex(function (g) {
                    return g.name === game
                 })+1 || -1;
     
                 if (index === -1) {
                     interaction.editReply(`**${game}** is not in your game log... Please check for spelling.`);
                     return;
                 }
     
                 // Removes game from array
                 logger.games.splice(index-1, 1);
                 await logger.save().catch((e) => {
                     console.log(e);
                     return;
                 });
     
                 interaction.editReply(`**${game}** removed from your game log.`);

            } catch (error) {
                console.log(error);
            }
        }


        if (subcommand === 'list') {
            if (!logger) {
                interaction.editReply('No game log found.');
                return;
            }

            const member = interaction.guild?.members.cache.get(mention) || interaction.user;
            const botAvatarURL = client.user.displayAvatarURL();

            listEmbedBase = {
                title: 'Game Completion Log for:',

                author: {
                    name: '/game-log list',
                    icon_url: botAvatarURL,
                    url: 'https://github.com/ChrissyFit/Overlord_PLUS',
                },
            
                color: 0x6b4683,
            
                description: "A list of this user's completed games.",
            
                thumbnail: {
                    url: member.displayAvatarURL(),
                },
            
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Remember that Overlord always watches...',
                    icon_url: botAvatarURL,
                },
                fields: [
                    {
                        name: '',
                        value: '',
                    },
                ],
            };

            const listEmbed = new EmbedBuilder(listEmbedBase)
                .setDescription(`<@!${mention}>  Games Completed: ${logger.games.length}`);

            for (const g of logger.games) {
                listEmbed.addFields({
                    name: `• ${g.name}`,
                    value: `${g.date.toLocaleDateString('en-US')}`,
                    });
            }

            listEmbed.addFields({ name: ' ', value: ' ', });

            interaction.editReply({ embeds: [listEmbed] });
        }
    },
};