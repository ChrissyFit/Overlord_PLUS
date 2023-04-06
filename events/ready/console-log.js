module.exports = {
    async execute(client) {
        try {
            console.log(`${client.user.tag} is now online`);
        } catch (error) {
            console.log(error);
        }
    }
}