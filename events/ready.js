const client = require("..");
const config = require("../settings/config.json");
const status = config.status;
client.on('ready', () => {
    console.log(`${client.user.username} ist Online`);
    client.user.setActivity(status,{type : "PLAYING"});
})