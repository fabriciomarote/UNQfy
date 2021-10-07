const Generate = require('./generate');
const generateId = new Generate();

class Album {
    constructor(name, year, author) {
        this.id = 'al_' + generateId.generateIdAlbum();
        this.name = name;
        this.year = year;
        this.author = author;
        this.duration = 0;
        this.tracks = [];
    }

    content() {
        console.log(this);
    }

    sumDuration(newTrackDuration) {
        this.duration += newTrackDuration;
    }

    subtractDuration(newTrackDuration) {
        this.duration -= newTrackDuration;
    }

    existsTrack(trackName) {
        return this.tracks.some(track => track === trackName); 
    }

    addTrack(track) {
        this.tracks.push(track);
        this.sumDuration(track.duration);
    }

    deleteTrack(track) {
        const pos = this.tracks.indexOf(track); 
        this.tracks.splice(pos, 1);
        this.subtractDuration(track.duration);
    }

    getTracks() {
        return this.tracks;
    }
}

module.exports = Album;