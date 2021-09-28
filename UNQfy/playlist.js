const Generate = require('./generate');
const generateId = new Generate();

class Playlist {
    constructor(name, genres) {
        this.id = 'p_' + generateId.generateIdPlaylist();
        this.name = name;
        this.duration = 0;
        this.genres = genres;
        this.tracks = [];
    }

    content() {
        console.log(this);
    }

    hasTrack(aTrack) {
        return this.tracks.some(track => track === aTrack);
    }

    addTrack(track) {
        this.tracks.push(track);
    }

    deleteTrack(track) {
        const pos = this.tracks.indexOf(track); 
        this.tracks.splice(pos, 1);
        this.subtractDuration(track.duration);
    }

    sumDuration(newTrackDuration) {
        this.duration += newTrackDuration;
    }

    subtractDuration(newTrackDuration) {
        this.duration -= newTrackDuration;
    }
}

module.exports = Playlist;