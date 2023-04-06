require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Must enter command ID
// for guild-based commands
rest.delete(Routes.applicationGuildCommand(
	process.env.CLIENT_ID, 
	process.env.GUILD_ID, 
	process.env.DELETE_COMMAND_ID,
	))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(
	process.env.CLIENT_ID,
	process.env.DELETE_COMMAND_ID,
	))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);