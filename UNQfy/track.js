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

    hasGenres(genres) {
        let genresT = [];
        genresT = genresT.concat(this.genres);
        while(genresT.length !== 1 && !genres.includes(genresT[0])) {
            genresT.shift();
        }
        return !genres.includes(genresT[0]);
    }

    sumAmount() {
        this.amountListened += 1;
    }
}

module.exports = Track;