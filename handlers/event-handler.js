const path = require('path');
const fs = require('fs');
const CronJob = require('cron').CronJob;


module.exports = (client) => {

    // Hourly sets checked to false if true
    let checked = false;
    const hourlyCheck = new CronJob(
        '@hourly', function () {
            checked = false;
        },
        null,
        true,
        'America/New_York'
    );


    // Searches through commands directory for events
    const foldersPath = path.join(__dirname, '..', 'events');
    const eventFolders = fs.readdirSync(foldersPath);

    for (const folder of eventFolders) {
        const eventsPath = path.join(foldersPath, folder);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        // Returns the event name from folder name. Don't ask me how.
        const eventName = folder.replace(/\\/g, '/').split('/').pop();
        
        client.on(eventName, async (...args) => {
            for (const file of eventFiles) {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);
                
                if (file === 'link-checker') {
                    args.push(checked);
                }

                await event.execute(client, ...args);
            }
        });
    }
}