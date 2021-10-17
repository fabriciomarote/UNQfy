const Generate = require('./generate');
const rp = require('request-promise');
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
        this.lyrics = "";
    }

    content() {
        console.log(this);
    }

    sumAmount() {
        this.amountListened += 1;
    }

    getDuration(){
        return this.duration;
    }

    getLyrics() {
        if(this.lyrics.length === 0) {
            const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
            let searchTrack = {
            uri: BASE_URL + '/track.search',
            qs: {
                apikey: '27eb6e88a480d6a3fbd0a2c100ac87ea',
                q_track: this.name,
                q_artist: this.author,
            },
            json: true
            };

            rp.get(
                searchTrack
            ).then((response) => {
                let header = response.message.header;
                let body = response.message.body;
                if (header.status_code !== 200){
                    throw new Error('status code != 200');
                }

                const trackId = body.track_list[0].track.track_id;

                const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
                    let trackLyric = {
                    uri: BASE_URL + '/track.lyrics.get',
                    qs: {
                        apikey: '27eb6e88a480d6a3fbd0a2c100ac87ea',
                        track_id: trackId,
                    },
                    json: true
                    }; 

                    rp.get(
                    trackLyric
                    ).then((response) => {
                    let headerLyrics = response.message.header;
                    let bodyLyrics = response.message.body;
                    if (headerLyrics.status_code !== 200){
                        throw new Error('status code != 200');
                    }

                    this.lyrics = bodyLyrics.lyrics.lyrics_body;
                });
            });  
            return this.lyrics;  
        }  else {
            return this.lyrics;  
        } 
    }    
}

module.exports = Track;