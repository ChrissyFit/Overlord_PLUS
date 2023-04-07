const { ApplicationCommandOptionType } = require('discord.js');
const Log = require('/home/ChrissyFit_PI/Projects/Overlord_Bot/commands/utility/log-files/Log.js');

module.exports = {
    data: {
        name: 'logger',
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

        const query = {
            userID: interaction.user.id,
        };
        const logger = await Log.findOne(query);

        if (subcommand === 'add') {
            try {
                if (logger) {
                    logger.games.push({ name: game });

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

                    await newLogger.save();
                }

                interaction.editReply('Success!');
            } catch (error) {
                console.log(error);
            }
        }

        if (subcommand === 'remove') {

            logger.games.findIndex(function (g) {
                if (g.name === game)
                    console.log(`${g.name}\n ${g.date}`);
            })
            console.log(logger.games.length);
            console.log('"logger remove" not implemented.');
            interaction.editReply('Not implemented.');
        }
    },
};