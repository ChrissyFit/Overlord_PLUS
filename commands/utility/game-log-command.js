const { ApplicationCommandOptionType } = require('discord.js');
const Log = require('/home/ChrissyFit_PI/Projects/Overlord_Bot/commands/utility/log-files/Log.js');

module.exports = {
    data: {
        name: 'game-log',
        description: 'Logs or removes a game from user database.',
        // Subcommands
        options: [
            {
                name: 'add',
                description: 'Adds a game to database.',
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
                name: 'remove',
                description: 'Removes game from database.',
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
        ],
        
    },
    hasSubCommands: true,

    async execute(interaction) {
        await interaction.deferReply();

        const subcommand = interaction.options._subcommand;
        const game = interaction.options.get('game').value;

        // Fetches the user specific query
        const query = {
            userID: interaction.user.id,
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

                    console.log(gameIndex);
                    if (gameIndex !== -1) {
                        interaction.editReply(`**${game}** already exist in your game log!`);
                        return;
                    }
                    logger.games.push({ name: game });

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
     
                 console.log(logger.games.length);
                 interaction.editReply(`**${game}** removed from your game log.`);

            } catch (error) {
                console.log(error);
            }
        }
    },
};