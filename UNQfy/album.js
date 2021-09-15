class Album {
    constructor(name, year, gender, author, duration) {
        this.id = 1
        this.name = name
        this.year = year
        this.gender = gender
        this.author = author
        this.duration = duration
        this.tracks = []
    }
}

module.exports = Album