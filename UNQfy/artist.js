const Generate = require('./generate');
const generateId = new Generate();

class Artist {
    constructor(name, country) {
        this.id = 'ar_' + generateId.generateIdArtist();
        this.name = name;
        this.albums = [];
        this.country = country;
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
        console.log(observer);
        console.log(this.observers[0]);
      }

    notifyObservers(nameFunction, param) {
        this.observers.forEach(observer => {
            observer.notify(nameFunction, param);
        }
            );
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
        this.notifyObservers("addAlbum", {artist: this, album: album});
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

    setName(newName) {
        this.name = newName;
    }

    setCountry(newCountry) {
        this.country = newCountry;
    }
}

module.exports = Artist;