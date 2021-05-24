var embedData = require("../utils/embedData");
var langs = require('langs');

function UpperCaseFirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var emojis = {
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣"
}

class Handler {
    mclient;
    constructor(mclient) {
        this.mclient = mclient;
    }

    async sendError(obj) {
        if(obj.channel) {
            msg.edit({
                content: "",
                embed: {
                    "title": "Error!",
                    "description": "We ran into some errors trying to process your request, if this error keeps occuring and you think that it is not your fault, then please join the support discord and report it!",
                    "url": "https://www.youtube.com/watch?v=5BZLz21ZS_Y",
                    "color": 13238834,
                    "footer": {
                      "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
                      "text": "i make bugs yes"
                    },
                    "thumbnail": {
                      "url": "https://media.tenor.com/images/7118e4f5c78a4192c9c1b156e6349b8a/tenor.gif"
                    },
                    "fields": [
                      {
                        "name": "Support Discord",
                        "value": obj.client.invite
                      }
                    ]
                  }
            })
        }else{
            obj.send({
                embed: {
                    "title": "Error!",
                    "description": "We ran into some errors trying to process your request, if this error keeps occuring and you think that it is not your fault, then please join the support discord and report it!",
                    "url": "https://www.youtube.com/watch?v=5BZLz21ZS_Y",
                    "color": 13238834,
                    "footer": {
                      "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
                      "text": "i make bugs yes"
                    },
                    "thumbnail": {
                      "url": "https://media.tenor.com/images/7118e4f5c78a4192c9c1b156e6349b8a/tenor.gif"
                    },
                    "fields": [
                      {
                        "name": "Support Discord",
                        "value": obj.client.invite
                      }
                    ]
                  }
            })
        }
    }

    sendUsage(msg, command, info) {
        msg.channel.send({
            "embed": {
                "title": "hello you dummy dum",
                "description": "so you are probably thinking \"whatttttttttt these commands are way too hard to understand, how could any mortal person ever use these ?!?!?!?\" and you are right, probably, if you are talking to potatoe, but you are not speaking to me, the bot. so what i am trying to tell you is, first you put the prefix \"" + msg.client.prefix + "\" then comes the command, in this case its **" + command + "**, and last but not least the parameters\n```" + info + "```so yeah thats it so now go away please",
                "url": "https://www.youtube.com/watch?v=i3yL-uBrRws",
                "color": 4340318,
                "footer": {
                  "icon_url": "https://s11.favim.com/orig/7/784/7843/78437/anime-cute-anime-girl-Favim.com-7843767.jpg",
                  "text": "like srsly guys, the commands are not that hard to understand"
                },
                "thumbnail": {
                  "url": "https://i.pinimg.com/originals/c9/67/25/c96725c406367bc55144a919a412b8b0.gif"
                },
                "fields": [
                  {
                    "name": "for the last 1%",
                    "value": "so, if you are still reading that must mean that you still havent understood how to use the command, right? well it doesnt matter, just join the [support discord](" + msg.client.invite + ") and pop a question nerd."
                  }
                ]
            }
        });
    }

    async displayChapter(msg, data = {
        page: 0,
        chapter: 0
    }) {
        data.chapter = data.chapter ?? 0
        data.page = data.page ?? 0
        data.chapters = data.chapters ?? await this.mclient.getChapters(data.manga);

        if(data.chapter >= data.chapters.length) {
            return;
        }
        if(data.chapter < 0) {
            return;
        }

        if(data.pages == undefined) {
            data.chapters = data.chapters ?? await this.mclient.getChapters(data.manga);
            data.pages = await this.mclient.getPages(data.chapters[data.chapter].data.id);
        }

        if(data.page >= data.pages.length) {
            data.page = 0;
            if(data.chapter == (data.chapters.length - 1)) {
                return;
            }
            data.chapter++;
            data.chapters = data.chapters ?? await this.mclient.getChapters(data.manga);
            data.pages = await this.mclient.getPages(data.chapters[data.chapter].data.id);
        }else if(data.page < 0) {
            if(data.chapter == 0) {
                return
            }
            data.chapter--;
            data.chapters = data.chapters ?? await this.mclient.getChapters(data.manga);
            data.pages = await this.mclient.getPages(data.chapters[data.chapter].data.id);
            data.page = (data.pages.length - 1)
        }
        //data = embedData.trim(data);
        var pageURL = data.pages[data.page];
        
        var embed = {
            "title": "read coward",
            "description": "Chapter **" + data.chapters[data.chapter].data.attributes.chapter + "** (" + (data.chapter + 1) + "/" + data.chapters.length + "), Page **" + (data.page + 1) + "** (" + (data.page + 1) + "/" + data.pages.length + ")",
            "url": "https://www.youtube.com/watch?v=9PpmYJLH30s",
            "color": 13532264,
            "footer": {
              "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
              "text": "session not working? resume from here with " + msg.client.prefix + "resume " + data.manga + "/" + data.chapter + "/" + data.page
            },
            "image": {
              "url": pageURL
            }
          };
        data.chapters = undefined
        data.pages = undefined;
        //require("fs").writeFileSync("yes.json", JSON.stringify(data, null, 4));

        msg.edit({
            content: "",
            embed: embedData.merge(embed, data)
        })
    }

    async handleReaction(reaction, user) {
        var data = embedData.extract(reaction.message.embeds[0])
        if(data) {
            if(user.id == data.author) {
                var msg = reaction.message;
                return data
            }
        }
    }

    async displayManga(msg, manga, user) {
        var embed = {
            "title": manga.name,
            "description": manga.description,
            "url": manga.data.attributes.links.ap ? "https://www.anime-planet.com/manga/" + manga.data.attributes.links.ap : undefined,
            "color": 4903346,
            "footer": {
              "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
              "text": "just react with the book icon to read"
            },
            "thumbnail": {
              "url": "https://i.pinimg.com/originals/4c/7f/3a/4c7f3ae8c924cab27a5b1317ca6fa848.gif"
            },
            "fields": [
              {
                "name": "Status",
                "value": UpperCaseFirst(manga.data.attributes.status),
                "inline": true
              },
              {
                "name": "Language",
                "value": langs.where("1", manga.data.attributes.originalLanguage).name,
                "inline": true
              },
              {
                "name": "Chapters",
                "value": (await manga.getChapters()).length,
                "inline": true
              }
            ]
          };
        
        msg.edit({
            content: "",
            embed: embedData.merge(embed, {
                author: user.id,
                manga: manga.id
            })
        })
        
        msg.react("📚");
    }

    selectManga(msg, info) {
        return new Promise(async (resolve, reject) => {
            var embed = {
                "title": "Manga Finder",
                "description": "Got **" + info.manga.length + "** results from [MangaDex](https://mangadex.org/).",
                "color": 4903346,
                "footer": {
                  "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
                  "text": "please choose a manga through an reaction"
                },
                "thumbnail": {
                  "url": "https://i.pinimg.com/originals/4c/7f/3a/4c7f3ae8c924cab27a5b1317ca6fa848.gif"
                },
                "fields": [

                ]
              }
            for (let i = 0; i < info.manga.length; i++) {
                const manga = info.manga[i];
                embed.fields.push({
                    "name": emojis[i+1],
                    "value": manga.name
                })
            }

            var send = await msg.channel.send({
                embed
              })
            
            var valid = []

            for (let i = 0; i < info.manga.length; i++) {
                valid.push(emojis[i+1])
                await send.react(emojis[i+1])
            }

            const filter = (reaction, user) => {
                return valid.includes(reaction.emoji.name) && user.id === msg.author.id;
            };

            send.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
	            .then(async (collected) => {
	            	const reaction = collected.first();
	            	if(valid.indexOf(reaction.emoji.name) !== -1) {
                        await send.reactions.removeAll();
                        resolve([info.manga[valid.indexOf(reaction.emoji.name)], send])
                    }
	            })
	            .catch(collected => {
	            	send.edit({
                        content: "",
                        "embed": {
                            "title": "Manga Finder",
                            "description": "you were not quick enough lol.",
                            "url": "https://discordapp.com",
                            "color": 4903346,
                            "footer": {
                              "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
                              "text": "the session is expired"
                            },
                            "thumbnail": {
                              "url": "https://i.pinimg.com/originals/4c/7f/3a/4c7f3ae8c924cab27a5b1317ca6fa848.gif"
                            }
                        }
                    });
                    send.reactions.removeAll();
                    reject();
	            });
            return;
        })
    }
}

module.exports = Handler;