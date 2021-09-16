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

}

module.exports = Album;