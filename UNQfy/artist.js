class Artist {
    constructor(name, country, genre) {
        this.id = this.generatorId();
        this.name = name;
        this.country =  country;
        this.genre = genre;
        this.albumes = [];
    }

    generatorId() {
        const prefix = 'a_';
        let seq = 0;
        seq += 1;
        const result = prefix + seq;
        return  result;    
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