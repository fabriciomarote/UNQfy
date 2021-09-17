
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

const Album = require('./album');
const Artist = require('./artist'); 
const Track = require('./track');

class UNQfy {
  constructor() {
    this.artists = [];
    this.playlists = [];
  }
 
  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    const artist = new Artist(artistData.name, artistData.country, artistData.genre);
    this.artists.push(artist);
    return artist;
  }

  contentArtist(artistId) {
    let content = false;
    this.artists.forEach( artist => {
        if(artist.id === artistId) {
            content = true;
        }
    });
    return content;
  }

  /*
  contentArtist(artistName) {
    const artists = this.artists;
    if (artists.length >=1 ) {
      while (artists.length !== 0 && artists[0].name !== artistName) { 
        artists.shift();
      }  
      return artists[0].name !== artistName;    
    }
  }
  */

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    const album = new Album(albumData.name, albumData.year, albumData.genre, albumData.author);
      this.artists.forEach(artist => {
        if (artist.id === artistId) {
             artist.albumes.push(album);
        }
      });
      return album; 
  }
    

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    const track = new Track(trackData.name, parseInt(trackData.duration), trackData.genres, trackData.author);
    this.artists.forEach(artist => {
      if (artist.contentAlbum(albumId)) {
        artist.albumes.forEach( album => {
          if (album.id === albumId) {
            album.tracks.push(track);
            album.setDuration(track.duration);
          }
        });
      }
    });
    return track;
  }

  deleteArtist(artistId) {
    if(this.contentArtist(artistId)) {
      const pos =  this.artists.indexOf(artistId);
      this.artists.splice(pos, 1);
    }
  }

  getArtistById(id) {
    return this.artists.find(artist => artist.id === id);
  }

  getAlbumById(id) {
    const albumes = this.artists.map(artist => artist.albumes);
    return albumes.find(album => album.id === id);
  }

  getTrackById(id) {
    const albumes = this.artists.map(artist => artist.albumes);
    const tracks = albumes.map(album => album.tracks);
    return tracks.find( track => track.id === id);
  }

  getPlaylistById(id) {
    return this.playlists.find(playlist => playlist.id === id);
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    const albumesFiltrados = this.artists.map(artist => artist.albumes).filter(album => genres.includes(album.genre));
    const tracks = albumesFiltrados.map(album => album.tracks);
    const tracksRes = tracks.filter(track => this.contentGenres(track.genres, genres));
        
    return tracksRes;
  }

  contentGenres(trackGenres, genres) {
    const trackMod = trackGenres;
    while(trackMod.length !== 0 && !genres.includes(trackMod[0])) {
      trackMod.shift();
    }
    return genres.includes(trackMod[0]);
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  searchByName() {

  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
};

