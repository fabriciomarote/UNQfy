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

    generatorId() {
        let prefix = 'al_';
        let seq = 0;
        return {
            set_prefix: function (p) {
                prefix = String(p);
            },
            set_seq: function (s) {
                seq = s;
            },
            gensym: function ( ) {
                const result = prefix + seq;
                seq += 1;
                return result;
            }
        };
    }

    sumDuration(newTrackDuration) {
        this.duration += newTrackDuration;
    }

    subtractDuration(newTrackDuration) {
        this.duration -= newTrackDuration;
    }

    contentTrack(trackId) {
        return this.tracks.some(track => track.id === trackId); 
    }

    addTrack(track) {
        this.tracks.push(track);
    }

    deleteTrack(track) {
        const pos =  this.tracks.indexOf(track.id); 
        this.tracks.splice(pos, 1);
        this.subtractDuration(track.duration);
        
    }
}

module.exports = Album;