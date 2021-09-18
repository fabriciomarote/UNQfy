class Album {
    constructor(name, year, genre, author) {
        this.id = 0;
        this.name = name;
        this.year = year;
        this.genre = genre;
        this.author = author;
        this.duration = 0;
        this.tracks = [];
    }

    setDuration(newTrackDuration) {
        this.duration += newTrackDuration;
    }

    contentTrack(trackId) {
        return this.tracks.some(track => track.id === trackId); 
    }

    addTrack(track) {
        this.tracks.push(track);
    }

    deleteTracks() {
        for (let i = 0; i <= this.tracks.length; i++) {
            this.tracks.splice(i, 1);
        }
    }

    deleteTrack(track) {
        const pos =  this.tracks.indexOf(track.id);
        this.tracks.splice(pos, 1);
    }
}

module.exports = Album;