const querystring = require('querystring');
const url = require('url');

var funcs = {}

funcs.merge = function (embed, data) {
    embed.footer = embed.footer ?? {
      "icon_url": "https://www.pinclipart.com/picdir/big/188-1885950_awooo-anime-right-clipart.png",
      "text": "uwu"
    };
    embed.footer.icon_url = embed.footer.icon_url + "?mangacord=" + Buffer.from(JSON.stringify(data)).toString('base64')
    return embed
}

funcs.trim = function(data) {
    var data = data;
    if(data.chapters) {
        for (let i = 0; i < data.chapters.length; i++) {
            data.chapters[i].result = undefined;
            data.chapters[i].relationships = undefined;
            data.chapters[i].data.type = undefined;
            data.chapters[i].data.attributes.volume = undefined;
            data.chapters[i].data.attributes.hash = undefined;
            data.chapters[i].data.attributes.dataSaver = undefined;
            data.chapters[i].data.attributes.publishAt = undefined;
            data.chapters[i].data.attributes.createdAt = undefined;
            data.chapters[i].data.attributes.updatedAt = undefined;
            data.chapters[i].data.attributes.version = undefined;
            data.chapters[i].data.attributes.translatedLanguage = undefined;
        }
    }

    return data;
}

funcs.extract = function(embed) {
    if(embed.footer == undefined) return;
    var query = url.parse(embed.footer.iconURL).query;
    if(query == undefined) return;
    var data = querystring.parse(query);
    if(data.mangacord == undefined) return;
    return JSON.parse(Buffer.from(data.mangacord, 'base64').toString('ascii'));
}

module.exports = funcs