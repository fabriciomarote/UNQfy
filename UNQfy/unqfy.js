
const picklify = require('picklify'); // para cargar/guardar unqfy
const fs = require('fs'); // para cargar/guardar unqfy
const Album = require('./album');
const Artist = require('./artist'); 
const Track = require('./track');
const Playlist = require('./playlist');
const User = require('./user');
const { ErrorResponse, DuplicatedError } = require('./responses');
const rp = require('request-promise');
const ObserverLogging = require('./observerLogging');
const ObserverNewsletter = require('./observerNewsletter');

class UNQfy {
  constructor() {
    this.artists = [];
    this.playlists = [];
    this.users = [];
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addObserverToArtists(observer) {
    this.artists.forEach( artist => artist.addObserver(observer));
  }

  notifyObservers(nameFunction, param) {
    this.observers.forEach(observer => observer.notify(nameFunction, param));
    //observerLogging.notify(nameFunction, param);
    
  }

  /////////////////////////// ARTISTA /////////////////////////////////////////////
 
  // artistData: objeto JS con los datos necesarios para crear un artista
  // artistData.name (string)
  // artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */  if(!this.existsArtist(artistData.name)) {
        const artist = new Artist(artistData.name, artistData.country);
        this.artists.push(artist);
        this.notifyObservers("addArtist", artist);
        this.save('data.json');
        return artist; 
    } else {   
      throw new ErrorResponse('The artist '+ artistData.name +' cannot be added because it already exists');
    }   
  }

  editArtist(artistId, artistData) {
    if (this.artists.some(artist => artist.id === artistId)) {
      const artist = this.getArtistById(artistId);
      artist.setName(artistData.name);
      artist.setCountry(artistData.country);
      this.save('data.json');
      return artist;
    } else {
      throw new ErrorResponse("The artist "+artistId+" does not exist");
    }  
  }

  editAlbum(albumId, albumYear) {
    if (this.getAlbums().some(album => album.id === albumId)) {
      const album = this.getAlbumById(albumId);
      album.setYear(albumYear);
      this.save('data.json');
      return album;
    } else {
      throw new ErrorResponse("The album "+albumId+" does not exist");
    }  
  }

  existsArtist(artistName) {
    return this.artists.some(artist => artist.name === artistName);
  }

  deleteArtist(artist) {
    const pos = this.artists.indexOf(artist);
      if(artist.getAlbums().lentgh === 0) {
        this.artists.splice(pos, 1);
    } else {
        artist.getAlbums().forEach(album => this.deleteAlbum(artist, album));
        this.artists.splice(pos, 1);
    }
    this.notifyObservers("deleteArtist", artist);
    this.save('data.json');
  }

  getArtistById(id) {
    if (this.artists.some(artist => artist.id === id)) {
      const artist = this.artists.find(artist => artist.id === id);
      return artist;
    } else {
      throw new ErrorResponse("The artist "+id+" does not exist");  
    }  
  }

  getArtists() {
    return this.artists; 
  }

  getArtistByName(name) {
    if (this.artists.some(artist => artist.name === name)) {
      return this.artists.find(artist => artist.name === name);
    } else {
      throw new ErrorResponse("The artist "+name+" does not exist");  
    } 
  }

  searchByArtist(artist) {
    const tracks = artist.getAlbums().flatMap(album => album.tracks);
    return tracks;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    if (this.artists.some(artist => artist.name === artistName)) { 
      const artist = this.artists.find(artist => artist.name === artistName);
      const tracksByArtist = artist.getAlbums().flatMap(album => album.tracks);
      return tracksByArtist;
    } else {
      throw new ErrorResponse("The artist "+artistName+" does not exist"); 
    }  
  }

  contentArtist(artist) {
    artist.content();
  }

 //////////////////////////////////////////////////   ALBUM  ////////////////////////////////////////////

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
      const album = new Album(albumData.name, albumData.year, artist.name);
      artist.addAlbum(album);
      this.notifyObservers("addAlbum", {artist: artist, album: album});
      this.save('data.json');
      return album; 
    } 
    else {
      throw new DuplicatedError("Can't add album "+albumData.name+" because it already exists");
    }
    
  }

  deleteAlbum(artist, album) {
    if(album.getTracks().lentgh === 0) {
      artist.deleteAlbum(album);
    } else {
      album.getTracks().forEach(track => this.deleteTrack(album, track));
      artist.deleteAlbum(album);
    }  
    this.notifyObservers("deleteAlbum", {artist: artist, album: album});
    this.save('data.json');
  }

  getAlbumById(id) {
    if (this.getAlbums().some(album => album.id === id)) {
      const album = this.getAlbums().find(album => album.id === id);
      return album;
    } else {
      throw new ErrorResponse("The album "+id+" does not exist");  
    }   

  }
  
  getAlbums() {
    const albums = this.artists.flatMap(artist => artist.albums);
    return albums; 
  }

  contentAlbum(album) {
    album.content();
  }

  ////////////////////////////////// TRACK ///////////////////////////////////////////

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
    const album = this.getAlbumById(albumId);
    if(!album.existsTrack(trackData.name)) {
      const track = new Track(trackData.name, trackData.duration, trackData.genres, trackData.album, trackData.author);
      album.addTrack(track);
      this.notifyObservers("addTrack", track);
      this.save('data.json');
      return track;
    } 
    else {
      throw new ErrorResponse("Can't add track "+trackData.name+" because it already exists");
    }
  }

  deleteTrack(album, track){
    album.deleteTrack(track);
    const playlists = this.playlists.filter(playlist => playlist.hasTrack(track));
    playlists.forEach(playlist => playlist.deleteTrack(track)); 
    this.notifyObservers("deleteTrack", track);
    this.save('data.json');
  }

  getTrackById(id) {
    if (this.getTracks().some(track => track.id === id)) {
      return this.getTracks().find( track => track.id === id);
    } else {
      throw new ErrorResponse("The track "+id+" does not exist"); 
    }  
  }

  contentTrack(track) {
    track.content();
  }

  getTracks() {
    return this.getAlbums().flatMap(album => album.tracks);
  }

  //////////////////////////////////////// PLAYLIST ////////////////////////////////////;;

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
      while(tracks.length !== 0 && playlist.getDuration() !== maxDuration) {
        const track = tracks.shift();
        if (playlist.getDuration()+track.getDuration() <= maxDuration) {
          playlist.addTrack(track);  
        }
      }
      this.addPlaylist(playlist);
      this.save('data.json');
      return playlist;
    } else {
      throw new ErrorResponse("Can't add playlist "+name+" because it already exists");
    }
  }

  addPlaylist(playlist){
    this.playlists.push(playlist);
    this.save('data.json');
  }
  
  deletePlaylist(playlist) {
    const pos = this.playlists.indexOf(playlist);
    if (playlist.getTracks().lentgh >= 1 ){
      playlist.getTracks().forEach (track => playlist.deleteTrack(track));
      this.playlists.splice(pos, 1);
    } else {
      this.playlists.splice(pos, 1);
    }
    this.save('data.json');
  }

  getPlaylistById(id) {
    if (this.playlists.some(playlist => playlist.id === id)) {
    return this.playlists.find(playlist => playlist.id === id);
  } else {
    throw new ErrorResponse("The album "+id+" does not exist"); 
    }
  }

  getPlaylists() {
    return this.playlists;
  }

  getPlaylistByName(name) {
    if (this.playlists.some(playlist => playlist.name === name)) {
      return this.playlists.find(playlist => playlist.name === name);
    } else {
      throw new ErrorResponse("The playlist "+name+" does not exist"); 
    } 
  }

  existsPlaylist(name) {
    return this.playlists.some(playlist => playlist.name === name);
  }

  contentPlaylist(playlist) {
    playlist.content();
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) { 
    const resultTrack = this.getTracks().filter(track => genres.some(genre => track.genres.includes(genre)));
    return resultTrack;   ///// FALLA
  }

  searchByGenre(genre) {
    const search = this.getAlbums().flatMap(album => album.getTracks().filter(track => track.genres.includes(genre)));
    return search;
  }

  searchByName(name) {
    const artists = this.artists.filter(artist =>  artist.name.includes(name));
    const albums = this.artists.flatMap(artist => artist.getAlbums().filter(album=> album.name.includes(name)));
    const allTracks = this.artists.flatMap(artist => artist.getAlbums().flatMap(album => album.getTracks()));
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

  play(trackName, userName){ 
    const track = this.getTracks().find(track => track.name === trackName);
    const user = this.users.find(user => user.name === userName);
    user.listenToA(track);
    this.save('data.json');
  }

  thisIs(artistName){
    //A que se refiere armar automaticamente / "On The Fly" preguntar 
    const tracks = this.getTracksMatchingArtist(artistName);
    tracks.sort( function (a, b){
      if( a.amountListened < b.amountListened){
        return 1;
      }
      if( a.amountListened > b.amountListened){
        return -1;
      }
      return 0;
    });
    const top = tracks.slice(0, 3);
    console.log(top);
    return top;
  }

  hasUser(aUser) {
    this.usuarios.some(user => user === aUser);
  }

  addUser(name) {
    const user = new User(name, this);
    if (!this.hasUser(user)) {
      this.users.push(user);
      this.save('data.json');
    } else {
      throw new ErrorResponse("Can't add user "+user.name+" because it already exists");
    } 
  }
  
  amountListen(user, aTrack) {
    user.amountListen(aTrack);
  }

  listenedTracks(user){
    user.listenedTracks();
  }

  getYear(string) {
    const newString = string;
    return newString.split('-')[0];
  }

  populateAlbumsForArtist(artistName) { 
    const token = 'BQAbaZnjMrcd7jUV0IWMR_SlXsUULuTNA532xYc064P-03j8eI00DNkWWXG2VUIObpsn9MRhpVIznz15443kNrMmfkIZICh9ioUled7VZ8vGk-T9r_pAANZfgNQQWUiwb5pZ0ervH0YQt_ACH0rJXAinKvB3';
    const options = {
     url: `https://api.spotify.com/v1/search?q=${artistName}&type=artist`,
     headers: { Authorization: 'Bearer ' + token},
     json: true,
    };

    rp.get(options).then((response) => {
        const artistSpotify = response.artists.items[0];
        
        const getAlbums = {
          url: `https://api.spotify.com/v1/artists/${artistSpotify.id}/albums`,
          headers: { Authorization: 'Bearer ' + token},
          json: true,
         };

         rp.get(getAlbums).then((responseAlbums) => {
          
          responseAlbums.items.forEach(alb => {
              const artist = this.getArtistByName(artistSpotify.name);
              const album = new Album(alb.name, parseInt(this.getYear(alb.release_date)), artistSpotify.name);
              artist.addAlbum(album); 
          });
          this.save('data.json');
        });
        
    });
  }

  getAlbumsForArtist(artistName) {
     const artist = this.getArtistByName(artistName);
     return artist.getAlbums();
  }

  getLyrics(track) {
    return track.getLyrics();
  }

  searchArtistsByName(artistName) {
    const artists = this.artists.filter(artist => 
      (artist.name.toLowerCase()).includes(artistName.toLowerCase()));
    return artists;
  }

  searchAlbumsByName(albumName) {
    const albums = this.artists.flatMap(artist => artist.getAlbums().filter(album=> (album.name.toLowerCase()).includes(albumName.toLowerCase())));
    return albums;
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist, ObserverNewsletter, ObserverLogging];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
};

