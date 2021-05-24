var request = require('request-promise');
class Manga {
    #data;
    constructor(data) {
        this.#data = data;
    }

    get name() {
        return this.#data.attributes.title.en ?? this.#data.attributes.title[Object.keys(this.#data.attributes.title)[0]]
    }

    async getChapters() {
        return JSON.parse(await request("https://api.mangadex.org/manga/" + this.id + "/feed?translatedLanguage[]=en&order[chapter]=asc")).results
    }

    get description() {
        var desc = this.#data.attributes.description.en ?? this.#data.attributes.description[Object.keys(this.#data.attributes.description)[0]]
        var desc = desc.replace(/\[[/]?spoiler\]/g, "||").replace(/\[[/]?b\]/g, "**").replace(/\[[/]?[^\]]+\]/g, "")
        var desc = desc.length > 2048 ? desc.substring(0, 2048) : desc;

        return desc;
    }

    get id() {
        return this.#data.id
    }

    get data() {
        return this.#data;
    }
}

module.exports = Manga;