process.on('uncaughtException', function(err) {
    console.log(err);
  });


const Discord = require('discord.js');
const fs = require("fs");

const client = new Discord.Client();

var Modules = {};
var LoadedEvents = {};
client.prefix = "!";
client.invite = "https://discord.gg/UtTJcWzCRe";

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function loadEvent(event) {
    if(LoadedEvents[event] == true) return;

    client.on(event, (...args) => {
        Object.values(Modules).forEach(Module => {
            Module.fireEvent(event, args)
        });
    })

    LoadedEvents[event] = true
}

function fireCommand(command, msg, args) {
    Object.values(Modules).forEach(Module => {
        Module.fireCommand(command, msg, args)
    })
}

function loadModule(name) {
    if(name == "all") {
        var ModuleList = fs.readdirSync("./modules/")
        ModuleList.forEach(ModuleName => loadModule(ModuleName));
        return
    }

    var newModule = requireUncached("./modules/" + name);
    Object.keys(newModule.events).forEach(event => {
        loadEvent(event);
    })
    if(newModule.name == "all") throw new Error("Module cant be called \"all\"!");
    newModule.client = client;
    newModule.fireEvent("ready");

    Modules[name] = newModule;
}

client.loadModule = loadModule;

loadModule("all");

function setPresence(){
    client.user.setPresence({ activity: { name: client.guilds.cache.size + ' guilds reading manga. | ' + client.prefix + 'help', type: "WATCHING" }, status: 'idle' })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(async () => {
        setPresence()
    }, 180000)

    setPresence()
});

client.on('message', msg => {
    var args = msg.content.split(" ");
    if(args[0].startsWith(client.prefix)) {
        var cmd = args.shift();
        
        fireCommand(cmd.replace(client.prefix, ""), msg, args)
    }
});

client.login(require("fs").readFileSync("token.txt", "utf-8"));