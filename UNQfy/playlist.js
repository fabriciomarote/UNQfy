class Playlist {
    constructor(name, duration, genres) {
        this.id = 1;
        this.name = name;
        this.duration = duration;
        this.genres = genres;
        this.tracks = [];
    }

    hasTrack(aTrack) {
        return this.tracks.some(track => track === aTrack);
    }

    addTrack(track) {
        this.tracks.push(track);
    }
}

module.exports = Playlist;