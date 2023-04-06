const { ApplicationCommandOptionType } = require('discord.js');
const { spawnSync } = require('child_process');
const path = require('path');


module.exports = {
    data: {
        name: 'muscleman',
        description: 'Creates a muscle man image with the inputted text after "You know who else".',
        options: [
            {
                name: 'prompt',
                description: 'Enter the phrase you want attached.',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    hasSubCommands: false,

    async execute(interaction) {
        try {
            const prompt = interaction.options.get('prompt').value;
            const musclemanPy = path.join(__dirname, './muscleman-files/muscleman_command.py');
            const image = path.join(__dirname, './muscleman-files/muscleman_meme_temp.png');
            
            spawnSync(
                'python3',
                [
                    musclemanPy,
                    prompt,
                ]
            );

            interaction.reply({
                files: [{
                    attachment: image,
                }],
            });
            return;

        } catch (error) {
            console.log(error);
        }
    }
}