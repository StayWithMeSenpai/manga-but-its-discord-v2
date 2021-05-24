function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

var Module = requireUncached("../classes/Module");
var MangaDex = requireUncached("../classes/Mangadex");
var Handler = requireUncached("../classes/Handler");

var mclient = new MangaDex();
var search = new Module("search");
var handler = new Handler(mclient);

search.registerCommand("search", async (msg, args) => {
    if(args.length > 0) {
        var searchString = args.join(" ");
        var response = await mclient.search(searchString)

        handler.selectManga(msg, response).then(([manga, nmsg]) => {
            handler.displayManga(nmsg, manga, msg.author)
        }).catch((err) => {
            //handler.sendError(nmsg);
        })
    }else {
        var command = "search"
        var info = "Parameter 1: the name of the manga that you want to read ???"
        handler.sendUsage(msg, command, info)
    }
    
})

search.registerCommand("resume", async (msg, args) => {
    if(args.length == 1) {
        var parts = args[0].split("/");
        if(parts.length == 3) {
            var nmsg = await msg.channel.send("loading....");
            nmsg.react("⬅️")
            nmsg.react("➡️")
            try {
                handler.displayChapter(nmsg, {
                    author: msg.author.id,
                    manga: parts[0],
                    chapter: parseInt(parts[1]),
                    page: parseInt(parts[2])
                })
            } catch (error) {
                handler.sendError(nmsg);
            }
        }else if(parts.length == 1){
            try {
                handler.displayManga(await msg.channel.send("loading..."), await mclient.getManga(args[0]), msg.author)
            } catch (error) {
                handler.sendError(nmsg);
            }
        }else {
            msg.reply("if you landed here, then i have no idea what i could even say to you as that would have just made me lose all my hope in humanity like wtf literally how i made it so clear to not temper with it and you just went ahead and did it you chicken tender!!!!!")
        }
    }else{
        var command = "resume"
        var info = "Parameter 0: i have like a premade template for this and i am too lazy to add an exception to remove the text above, but let me just tell you, dont you dare use this command with your own paramaters your dirty cirminal! just wait patiently until the bot gives you a complete command ^^"
        handler.sendUsage(msg, command, info)
    }
})

search.registerCommand("help", async (msg) => {
    msg.channel.send("", {
        "embed": {
          "title": "Command List",
          "description": "List of commands that the bot supports lol",
          "color": 755311,
          "footer": {
            "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
            "text": "O kawaii koto, you need help?"
          },
          "thumbnail": {
            "url": "https://i.pinimg.com/originals/63/d0/b7/63d0b791c8bb9c473e822b380d153c8d.gif"
          },
          "fields": [
            {
              "name": "**" + msg.client.prefix + "help**",
              "value": "shows this help panel duh.",
              "inline": false
            },
            {
              "name": "**" + msg.client.prefix + "search [manga-name]**",
              "value": "searches for the manga and like lets you pick which one you meant or something idk.",
              "inline": false
            },
            {
              "name": "**" + msg.client.prefix + "resume [data]**",
              "value": "that is something the bot gives you from time to time and you dont really need to know how it works but just remember that when the bot gives it to you and you want to continue the manga later then you need it kthx. (also pls dont temper with it or i will get mad >:( ))",
              "inline": false
            },
            {
                "name": "support discord",
                "value": "so uh we have this one discord for people that are really nice and want to talk to me (totally anyone would want that) and for people that just need support so uh please join uwu. and ohhhh yeahhh totally forgot to add the link so here: " + msg.client.invite,
                "inline": false
              },
            {
              "name": "spelling mistakes / grammer",
              "value": "yes they are like on purpose and its not like i suck at english or anything. *please report them in my [discord](" + msg.client.invite + ")*",
              "inline": false
            }
          ]
        }
      })
})

search.registerEvent("messageReactionAdd", async (reaction, user) => {
    if(user.id == search.client.user.id) return;
    if(reaction.message.author.id == search.client.user.id) {
        var msg = reaction.message;
        if(reaction.emoji.name == "📚") {
            if(msg.embeds.length > 0) {
                if(msg.embeds[0].footer) {
                    if(msg.embeds[0].footer.text == "just react with the book icon to read") {
                        var data = await handler.handleReaction(reaction, user)
                        if(data) {
                            msg.reactions.removeAll();
                            msg.react("⬅️")
                            msg.react("➡️")
                            handler.displayChapter(msg, data)
                        }
                    }
                }
            }
        }else{
            if(msg.embeds.length > 0) {
                if(msg.embeds[0].footer) {
                    if(msg.embeds[0].title == "read coward") {
                        if(reaction.emoji.name == "⬅️") {
                            var data = await handler.handleReaction(reaction, user)
                            if(data) {
                                data.page = data.page - 1
                                handler.displayChapter(msg, data)
                            }
                        }else if(reaction.emoji.name == "➡️") {
                            var data = await handler.handleReaction(reaction, user)
                            if(data) {
                                data.page = data.page + 1
                                handler.displayChapter(msg, data)
                            }
                        }
                    }
                }
            }
        }
        reaction.users.remove(user)
    }
})

module.exports = search;