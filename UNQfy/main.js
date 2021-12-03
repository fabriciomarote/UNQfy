const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const ErrorResponse = require('./responses');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

const unqfy = getUNQfy();

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Album
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)
*/

function addArtist(unqfy, name, country){
  unqfy.addArtist({name:name, country: country}); 
  }

function deleteArtist(unqfy, name) {
  if(unqfy.existsArtist(name)) {
    const artist = unqfy.getArtistByName(name);
    unqfy.deleteArtist(artist);
  } else {
    throw new ErrorResponse("Can't delete artist "+name+" because doesn't exist");
  }
}

function addAlbum(unqfy, artistName, name, year){
  if(unqfy.existsArtist(artistName)) {
    const artist = unqfy.getArtistByName(artistName);
    unqfy.addAlbum(artist.id, {name:name, year: parseInt(year)});
  } else {
    throw new ErrorResponse("Can't add album because artist "+artistName+" doesn't exist");
  }
}  

function deleteAlbum(unqfy, artistName, name) {
  if(unqfy.existsArtist(artistName)) {
    const artist = unqfy.getArtistByName(artistName);
    if(artist.existsAlbum(name)) {
      const album = artist.getAlbumsByName(name);
      unqfy.deleteAlbum(artist, album);
    } else {
      throw new ErrorResponse("Can't delete album because doesn't exist");
    } 
  } else {
    throw new ErrorResponse("Can't delete album because artist "+artistName+" doesn't exist");
  }
}

function addTrack(unqfy, artistName, albumName, name, duration, genres) {
  if(unqfy.existsArtist(artistName)) {
    const artist = unqfy.getArtistByName(artistName);
    if(artist.existsAlbum(albumName)) {
      const album = artist.getAlbumsByName(albumName);
      unqfy.addTrack(album.id, {name: name, duration: parseInt(duration), genres: genres.split(','), album: album.name, author: artist.name});
    } else {
      throw new ErrorResponse("Can't add track because album "+albumName+" doesn't exist");
    }
  } else {
    throw new ErrorResponse("Can't add track because artist "+artistName+" doesn't exist");
  }
}

function deleteTrack(unqfy, artistName, albumName, name) {
  const artist = unqfy.getArtistByName(artistName);
  const album = artist.getAlbumsByName(albumName);
  const track = album.getTracks().find(track => track.name === name);
  if(artist !== undefined && album !== undefined && track !== undefined) {
    unqfy.deleteTrack(album, track);
  } else {
    throw new ErrorResponse("Can't delete track "+name+" because artist, album or track doesn't exist");
  }  
}

function searchByName(unqfy, name) {
  unqfy.searchByName(name);
}

function searchByArtist(unqfy, artistName) {
  const artist = unqfy.getArtistByName(artistName);
  unqfy.searchByArtist(artist);
}

function searchByGenre(unqfy, genre) {
  unqfy.searchByGenre(genre);
}

function createPlaylist(unqfy, name, genres, duration) {
  unqfy.createPlaylist(name, genres.split(','), parseInt(duration));
}

function getTracksMatchingArtist(unqfy, artistName) {
  if(unqfy.existsArtist(artistName)) {
    unqfy.getTracksMatchingArtist(artistName);
  } else {
    throw new ErrorResponse('The tracks cannot be returned because the artist '+artistName+' does not exist');
  }   
}

function getTracksMatchingGenres(unqfy, genres) {
  unqfy.getTracksMatchingGenres(genres.split(','));
}

function deletePlaylist(unqfy, name) {
  if(unqfy.existsPlaylist(name)) {
    const playlist = unqfy.getPlaylistsByName(name);
    unqfy.deletePlaylist(playlist);
  } else {
    throw new ErrorResponse("Can't delete playlist "+name+" because doesn't exist");
  }
}

function contentArtist(unqfy, name) {
  if(unqfy.existsArtist(name)) {
    const artist = unqfy.getArtistByName(name);
    unqfy.contentArtist(artist);
  } else {
    throw new ErrorResponse("Not exist the artist "+name);   
  }  
}

function contentPlaylist(unqfy, name) {
  if(unqfy.existsPlaylist(name)) {
    const playlist = unqfy.getPlaylistsByName(name);
    unqfy.contentPlaylist(playlist);
  } else {
    throw new ErrorResponse("Not exist the playlist "+name);   
  } 
}

function contentAlbum(unqfy, name) {
  if(unqfy.getArtists().some(artist => artist.existsAlbum(name))) {
    const album = unqfy.getAlbums().find(album => album.name === name);
    unqfy.contentAlbum(album);
  } else {
    throw new ErrorResponse("Not exist the album "+name);   
  } 
}

function contentUnqfy() {
  unqfy.contentUnqfy();
}

function contentTrack(unqfy, name) {
  const tracks = unqfy.getTracks();
  if(tracks.some(track => track.name === name)) {
   const track = tracks.find(track => track.name === name);
   unqfy.contentTrack(track);
 } else {
  throw new ErrorResponse("Not exist the track "+name);   
 } 
}

function addUser (unqfy, name){
 unqfy.addUser(name);
}

function thisIs(unqfy, name){
  if (unqfy.existsArtist(name)){
    unqfy.thisIs(name);
  } else {
    throw new ErrorResponse("Not exist the artist "+name);   
  } 
}

function play(unqfy, track, user){
  unqfy.play(track, user);
}

function getLyrics(unqfy, trackName) {
  const tracks = unqfy.getTracks();
  if(tracks.some(track => track.name === trackName)) {
    const track = tracks.find(track => track.name === trackName);
    unqfy.getLyrics(track);
  } else {
    throw new ErrorResponse("The track "+trackName+" not exist");   
  } 
}

function populateAlbumsForArtist(unqfy, artistName) {
  if(unqfy.existsArtist(artistName)) {
    unqfy.populateAlbumsForArtist(artistName);
  } else {
    throw new ErrorResponse("The artist "+artistName+" not exist");
  } 
}

function getAlbumsForArtist(unqfy, artistName) {
  if(unqfy.existsArtist(artistName)) {
    unqfy.getAlbumsForArtist(artistName);
  } else {
    throw new ErrorResponse("The artist "+artistName+" not exist");
  } 
}

function searchArtistsByName(unqfy, name) {
  unqfy.searchArtistsByName(name);
}

function getArtists(unqfy) {
  unqfy.getArtists();
}



function main() {
  const arguments_ = process.argv.splice(2);
  try {
    if (arguments_[0] === "addArtist"){
      addArtist(unqfy, arguments_[1], arguments_[2]);
    } else if (arguments_[0] === "addAlbum") {
      addAlbum(unqfy, arguments_[1], arguments_[2], arguments_[3]);
    } else if (arguments_[0] === "addTrack") {
      addTrack(unqfy, arguments_[1], arguments_[2], arguments_[3], arguments_[4], arguments_[5]);
    } else if (arguments_[0] === "deleteArtist") {
      deleteArtist(unqfy, arguments_[1]);
    } else if (arguments_[0] === "deleteAlbum") {
      deleteAlbum(unqfy, arguments_[1], arguments_[2]);
    } else if (arguments_[0] === "deleteTrack") {
      deleteTrack(unqfy, arguments_[1], arguments_[2], arguments_[3]);
    } else if (arguments_[0] === 'createPlaylist') {
      createPlaylist(unqfy, arguments_[1], arguments_[2], arguments_[3]);
    } else if (arguments_[0] === 'deletePlaylist') {
      deletePlaylist(unqfy, arguments_[1]);
    } else if (arguments_[0] === "addUser") {
      addUser(unqfy, arguments_[1]);
    } else if (arguments_[0] === "play") {
      play(unqfy, arguments_[1], arguments_[2]);
    } 

    if (arguments_[0] === 'searchByName') {
      searchByName(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'searchByArtist') {
      searchByArtist(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'searchByGenre') {
      searchByGenre(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'getTracksMatchingArtist') {
      getTracksMatchingArtist(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'getTracksMatchingGenres') {
      getTracksMatchingGenres(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'contentPlaylist') {
      contentPlaylist(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'contentAlbum') {
      contentAlbum(unqfy, arguments_[1]);
    } else if (arguments_[0] === 'contentTrack') {
      contentTrack(unqfy, arguments_[1]);
    }  else if (arguments_[0] === 'contentArtist') {
      contentArtist(unqfy, arguments_[1]);
    }  else if (arguments_[0] === 'contentUnqfy') {
      contentUnqfy();
    } else if (arguments_[0] === "thisIs") {
      thisIs(unqfy, arguments_[1]);
    } else if (arguments_[0] === "getLyrics") {
      getLyrics(unqfy, arguments_[1]);
    } else if (arguments_[0] === "getAlbumsForArtist") {
      getAlbumsForArtist(unqfy, arguments_[1]);
    } else if (arguments_[0] === "searchArtistsByName") {
      searchArtistsByName(unqfy, arguments_[1]);
    } else if (arguments_[0] === "getArtists") {
      getArtists(unqfy);
    } else if (arguments_[0] === "populateAlbumsForArtist") {
      populateAlbumsForArtist(unqfy, arguments_[1]);
    } 
  } catch(error) {
      console.log(error);
  }
}

main();

module.exports = { getUNQfy };
