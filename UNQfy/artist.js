const Generate = require('./generate');
const generateId = new Generate();

class Artist {
    constructor(name, country) {
        this.id = 'ar_' + generateId.generateIdArtist();
        this.name = name;
        this.albums = [];
        this.country =  country;
    }

    content() {
        console.log(this);
    }

    existsAlbum(albumName) {
        return this.albums.some(album => album.name === albumName); 
    }

    hasAlbum(albumId) {
        return this.albums.some(album => album.id === albumId); 
    }

    addAlbum(album) {
        this.albums.push(album);
    }

    deleteAlbum(album) {
      const pos = this.albums.indexOf(album);
      this.albums.splice(pos, 1);
    }

    getAlbums(){
        return this.albums;
    }

    getAlbumsByName(name){
        return this.getAlbums().find(album => album.name === name);
    }
}

module.exports = Artist;