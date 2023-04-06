module.exports = {
    async execute(client, interaction) {
        try {
            if (!interaction.isChatInputCommand()) return;
            
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.log(`No command matching ${interaction.commandName}.`);
                return;
            }

            await command.execute(interaction, client);

        } catch (error) {
            console.log(error);
        }
    }
}