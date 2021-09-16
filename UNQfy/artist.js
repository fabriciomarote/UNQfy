class Artist {
    constructor(name, country, genre) {
        this.id = 0;
        this.name = name;
        this.country =  country;
        this.genre = genre;
        this.albumes = [];
    }

    contentAlbum(albumId) {
        let content = false;
        this.albumes.forEach( album => {
            if(album.id === albumId) {
                content = true;
            }
        });
        return content;
    }
}

module.exports = Artist;