module.exports = {
    async execute(client, message, checked) {
        if (checked) return;
        if (message.channel.id !== '665363287805919262') return; // ID for general channel
        if (message.content.includes('tenor')) return;

        if (message.content.includes('http') || message.content.includes('www.')) {
            message.reply('Please use the channel <#889614857534574672> when posting links.'); // ID for videos and links channel
            checked = true;
        }
        
    }
}