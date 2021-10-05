const Generate = require('./generate');
const generateId = new Generate();

class Track {
    constructor(name, duration, genres, album, autor) {
        this.id = 't_' + generateId.generateIdTrack();
        this.name = name;
        this.duration = duration;
        this.genres = genres;
        this.album = album;
        this.author = autor;
        this.amountListened = 0;
    }

    content() {
        console.log(this);
    }

    sumAmount() {
        this.amountListened += 1;
    }
}

module.exports = Track;