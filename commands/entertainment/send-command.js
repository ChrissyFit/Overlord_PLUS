const { ApplicationCommandOptionType } = require('discord.js');


module.exports = {
    data: {
        name: 'send',
        description: 'Sends either a text or attachment.',
        // Subcommands
        options: [
            {
                name: 'text',
                description: 'Sends text via bot.',
                options: [
                    {
                        name: 'text',
                        description: 'Enter in text.',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
                type: 1, // Subcommand type
            },
            {
                name: 'attachment',
                description: 'Sends an image via bot.',
                options: [
                    {
                        name: 'attachment',
                        description: 'Attach an image.',
                        type: ApplicationCommandOptionType.Attachment,
                        required: true,
                    }
                ],
                type: 1, // Subcommand type
            },
        ],
        
    },
    hasSubCommands: true,

    async execute(interaction) {
        const subcommand = interaction.options._subcommand;
        const input = interaction.options.get('text')?.value || 
        interaction.options.getAttachment('attachment');

        if (subcommand === 'text') {
            await interaction.channel.send(`${input}`);
            await interaction.reply({ content: 'Success ✅', ephemeral: true });
        }
        
        if (subcommand === 'attachment') {
            await interaction.channel.send({
                files: [{
                    attachment: input.url,
                }],
            });
            await interaction.reply({ content: 'Success ✅', ephemeral: true });
        }
    },
};