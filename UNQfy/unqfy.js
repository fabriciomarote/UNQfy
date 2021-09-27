
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

const Album = require('./album');
const Artist = require('./artist'); 
const Track = require('./track');
const Playlist = require('./playlist');

class UNQfy {
  constructor() {
    this.artists = [];
    this.playlists = [];
  }
 
  // artistData: objeto JS con los datos necesarios para crear un artista
  // artistData.name (string)
  // artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    if(!this.existsArtist(artistData.name)) {
      const artist = new Artist(artistData.name, artistData.country, artistData.genre);
      this.artists.push(artist);
      console.log('The artist '+artistData.name+' was added successfully');
      return artist; 
    } else {
      return console.log('The artist '+artistData.name+' cannot be added because it already exists');
    }   
  }

  existsArtist(artistName) {
    return this.artists.some(artist => artist.name === artistName);
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  // albumData.name (string)
  // albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    const artist = this.getArtistById(artistId);
    if(!artist.existsAlbum(albumData.name)) {
      const album = new Album(albumData.name, albumData.year, albumData.genre, albumData.author);
      artist.addAlbum(album);
      console.log('The album '+albumData.name+' was added successfully');
      return album; 
    } else {
      return console.log("Can't add album "+albumData.name+" because it already exists");
    }
  }

  // trackData: objeto JS con los datos necesarios para crear un track
  // trackData.name (string)
  // trackData.duration (number)
  // trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    const artist = this.artists.find(artist =>  artist.hasAlbum(albumId));
    const album = artist.albumes.find(album => album.id === albumId);
    const track = new Track(trackData.name, parseInt(trackData.duration), trackData.genres, trackData.album, trackData.author);
    album.addTrack(track);
    album.sumDuration(track.duration);
    console.log('The track '+trackData.name+' was added successfully');
    return track;
  }

  deleteArtist(artist) {
    const pos = this.artists.indexOf(artist.id);
    if(artist.albumes.length === 0) {
      this.artists.splice(pos, 1);
    } else {
      artist.albumes.forEach(album => this.deleteAlbum(artist, album));
      this.artists.splice(pos, 1);
    }
    console.log('The artist '+artist.name+' was deleted successfully');
  }

  deleteAlbum(artist, album) {
    if(album.tracks.length === 0) {
      artist.deleteAlbum(album);
    } else {
      album.tracks.forEach(track => this.deleteTrack(album, track));
      artist.deleteAlbum(album.id);
    }
    console.log('The album '+album.name+' was deleted successfully');
  }

  deleteTrack(album, track){
    const playL = this.playlists.filter(playlist => playlist.hasTrack(track));
    playL.forEach(p => p.deleteTrack(track.id));  
    album.deleteTrack(track);
    console.log('The track '+track.name+' was deleted successfully');
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
    const albumes = this.artists.flatMap(artist => artist.albumes);  
    const tracks = albumes.flatMap(album => album.tracks);
    const resultTrack = tracks.filter(track => track.hasGenres(genres) );
    return resultTrack;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    const artist = this.artists.find(artist => artist.name === artistName);
    const tracksByArtist = artist.albumes.flatMap(album => album.tracks);
    return tracksByArtist;
  }

  existsPlaylist(name) {
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
    if(!this.existsPlaylist(name)) {
      const playlist = new Playlist(name, genresToInclude);
      const tracks = this.getTracksMatchingGenres(genresToInclude);
      tracks.forEach( track => { 
        if (playlist.duration+track.duration <= maxDuration){
          playlist.addTrack(track);
          playlist.sumDuration(track.duration);
        }
      });
      this.addPlaylist(playlist);
      console.log('The playlist '+playlist.name+' was added successfully');
      return playlist;
    }
  }

  addPlaylist(playlist){
    this.playlists.push(playlist);
  }

  deletePlaylist(playlist) {
    const pos = this.playlists.indexOf(playlist.id);
    this.playlists.splice(pos, 1);
    console.log('The playlist '+playlist.name+' was deleted successfully');
  }

  searchByName(name) {
    const artists = this.artists.filter(artist =>  artist.name.includes(name));
    const albums = this.artists.flatMap(artist => artist.albumes.filter(album=> album.name.includes(name)));
    const allTracks = this.artists.flatMap(artist => artist.albumes.flatMap(album => album.tracks));
    const tracks = allTracks.filter(track => track.name.includes(name));
    const playlists = this.playlists.filter(playlist => playlist.name.includes(name));
    const search = {
      artists: artists,
      albums: albums,
      tracks: tracks,
      playlists: playlists,
    }; 
    return search;
  }

  searchByArtist(artist) {
    const search = [];
    const arts = this.artists.filter(art => art === artist );
    search.concat(arts);
    return search;
  }

  searchByGenre(genre) {
    const search = [];
    const albumesByGenre = this.artists.map(artist => artist.albumes.filter(album => album.genre === genre));
    albumesByGenre.forEach(album => search.concat(album.tracks));
    return search;
  }

  contentArtist(artist) {
    artist.content();
  }

  contentPlaylist(playlist) {
    playlist.content();
  }
  
  contentAlbum(album) {
    console.log(album);
    album.content();
  }

  contentTrack(track) {
    track.content();
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
};

