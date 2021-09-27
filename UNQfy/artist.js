const Generate = require('./generate');
const generateId = new Generate();

class Artist {
    constructor(name, country, genre) {
        this.id = 'ar_' + generateId.generateIdArtist();
        this.name = name;
        this.country =  country;
        this.genre = genre;
        this.albumes = [];
    }

    content() {
        console.log(this);
    }

    existsAlbum(albumName) {
        return this.albumes.some(album => album.name === albumName); 
    }

    hasAlbum(albumId) {
        return this.albumes.some(album => album.id === albumId); 
    }

    addAlbum(album) {
        this.albumes.push(album);
    }

    deleteAlbum(album) {
      const pos = this.albumes.indexOf(album);
      this.albumes.splice(pos, 1);
    }
}

module.exports = Artist;