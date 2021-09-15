const Track = require("./track")

class Playlist {
    constructor(name,duration, gender) {
        this.id = 1
        this.name = name
        this.duration = duration
        this.gender = gender 
        this.tracks = []
    }

    hasTrack(aTrack) {}
}

module.exports = Track