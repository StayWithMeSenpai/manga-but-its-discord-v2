var Module = require("../classes/Module");
var reload = new Module("reload");

//reload.registerCommand("reload", (msg, args) => {
//    reload.client.loadModule("all");
//    msg.reply("Reloaded");
//    return;
//})

module.exports = reload;