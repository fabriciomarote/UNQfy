
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

const Album = require('./album');
const Artist = require('./artist'); 
const Track = require('./track');
const { isUndefined } = require('util');
const Playlist = require('./playlist');

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
    return this.artists.some(artist => artist.id === artistId);
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
    if(this.contentArtist(artistId)) {
      const artist = this.artists.find(artist => artist.id === artistId );
      artist.addAlbum(album);
      return album; 
    } else {
      return console.log('No se puede agregar el album '+album.name+ 'porque el artist no existe');
    }
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
    const track = new Track(trackData.name, parseInt(trackData.duration), trackData.genres, trackData.album, trackData.author);
    this.artists.forEach(artist => {
      if(artist.contentAlbum(albumId)) {
        const album = artist.albumes.find(album => album.id === albumId);
        album.addTrack(track);
        album.setDuration(track.duration);
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

  deleteAlbum(artistId, albumId) {
    if(this.contentArtist(artistId)) {
      const artist = this.artists.find(artist => artist.id === artistId );
      if(artist.contentAlbum(albumId)) {
        const album = artist.albumes.find(album => album.i === albumId);
        if(album.tracks.length === 0) {
          artist.deleteAlbum(album);
        } else {
          album.deleteTracks();
        }
      }
    }
  }
/*
  deleteTrack(artistId, albumId, trackId) {
    if(this.contentArtist(artistId)) {
      const artist = this.artists.find(artist => artist.id === artistId );
      if(artist.contentAlbum(albumId)) {
        const album = artist.albumes.find(album => album.id === albumId);
        if(album.contentTrack(trackId)) {
          const track = album.tracks.find(track => track.id === trackId);
          album.deleteTrack(track);
        }
      }
    }  
  }
*/

  deleteTrack(artistId, trackId){
    this.playlists.forEach(playL => playL.tracks.filter (track => track !== trackId));
    const artist = this.artists.find(artist => artist === artistId);
    artist.albumes.forEach(album => album.tracks.filter(track => track !== trackId));
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
    let tracksByArtist = [];
    const artistR = this.artists.find(artist => artist.name === artistName);
    if (artistR !== undefined){
      tracksByArtist = artistR.albumes.forEach(listTrack => tracksByArtist.concat(listTrack));
    }
    return tracksByArtist;
  }

  contentPlaylist(name) {
    return this.playlists.some(playlist => playlist.name === name);
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
    if(!this.contentPlaylist(name)) {
      const playlist = new Playlist(name, maxDuration, genresToInclude);
      const tracks = this.getTracksMatchingGenres(genresToInclude);
      while( tracks[0].duration <= playlist.duration) {
        !playlist.hasTrack(tracks[0]) ? playlist.addTrack(tracks[0]) : [];
         tracks.shift();
      }
    }
    return this.playlist;
  }

  searchByName(name) {
    const artistsByName = this.artists.filter(artist =>  artist.name.includes(name));
    const albumes = this.artists.map(artist => artist.albumes);
    const albumesByName = albumes.filter(album => album.name.includes(name));
    const tracksByName = albumes.map(album => album.tracks).filter(track => track.name.includes(name));
    const search = [artistsByName + albumesByName + tracksByName];
    console.log(search);
    return search;
  }

  searchByArtist(artist) {
    const search = [];
    artist.albumes.forEach(album => search.concat(album.tracks));
    console.log(search);
    return search;
  }

  searchByGenre(genre) {
    const search = [];
    const albumesByGenre = this.artists.map(artist => artist.albumes).filter(album => album.genre === genre);
    albumesByGenre.forEach(album => search.concat(album.tracks));
    console.log(search);
    return search;
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

