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

    existsAlbum(albumName) {
        return this.albumes.some(album => album.name === albumName); 
    }

    contentAlbum(albumId) {
        return this.albumes.some(album => album.id === albumId); 
    }

    addAlbum(album) {
        this.albumes.push(album);
    }

    deleteAlbum(albumId) {
      const pos = this.albumes.indexOf(albumId);
      this.albumes.splice(pos, 1);
    }
}

module.exports = Artist;