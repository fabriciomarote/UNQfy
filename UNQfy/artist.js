const Generate = require('./generate');
const generateId = new Generate();

class Artist {
    constructor(name, country) {
        this.id = 'ar_' + generateId.generateIdArtist();
        this.name = name;
        this.country =  country;
        this.albumes = [];
        this.albumsBySpotify = [];
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

    getAlbumes(){
        return this.albumes;
    }

    getAlbumesByName(name){
        return this.getAlbumes().find(album => album.name === name);
    }
}

module.exports = Artist;