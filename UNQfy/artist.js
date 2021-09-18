class Artist {
    constructor(name, country, genre) {
        this.id = 0;
        this.name = name;
        this.country =  country;
        this.genre = genre;
        this.albumes = [];
    }

    contentAlbum(albumId) {
        return this.albumes.some(album => album.id === albumId); 
    }
    
    addAlbum(album) {
        this.albumes.push(album);
    }

    deleteAlbum(album) {
      const pos = this.albumes.indexOf(album.id);
      this.albumes.splice(pos, 1);
    }
}

module.exports = Artist;