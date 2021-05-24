function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

var request = require('request-promise');
var Manga = requireUncached("./Manga");
var NodeCache = require("node-cache");
var myCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

class MangaDex {
    constructor() {

    }

    async search(title, limit) {
        var limit = limit ?? 5
        var response = JSON.parse(await request("https://api.mangadex.org/manga?title=" + encodeURIComponent(title) + "&contentRating[]=safe&contentRating[]=suggestive&limit=" +  limit))
        var data = [];

        for (let i = 0; i < response.results.length; i++) {
            const result = response.results[i];
            if(result.result == "ok") {
                data.push(new Manga(result.data));
            }
        }
        response.manga = data
        return response;
    }

    async getManga(id) {
        var response = JSON.parse(await request("https://api.mangadex.org/manga/" + id + "/"));
        return new Manga(response.data);
    }

    async getChapters(id) {
        var val = myCache.get(id)
        if(val) {
            return val;
        }

        var result = JSON.parse(await request("https://api.mangadex.org/manga/" + id + "/feed?translatedLanguage[]=en&order[chapter]=asc")).results
        myCache.set(id, result)

        return result;
    }

    async getPages(id) {
        return new Promise(async (resolve, reject) => {
            var val = myCache.get(id)
            if(val) {
                return resolve(val);
            }
            var urls = []
            var baseURL = JSON.parse(await request("https://api.mangadex.org/at-home/server/" + id)).baseUrl
            var parts = JSON.parse(await request("https://api.mangadex.org/chapter/" + id))
            for (let i = 0; i < parts.data.attributes.data.length; i++) {
                const part = parts.data.attributes.data[i];
                urls.push(baseURL + "/data/" + parts.data.attributes.hash + "/" + part);
            }
            myCache.set(id, urls);
            return resolve(urls);
        })
    }
}

module.exports = MangaDex;