const fs = require('fs'); // necesitado para guardar/cargar unqfy
//const unqfy = require('./unqfy');
const unqmod = require('./unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

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

function addArtist(unqfy, name, country, genre){
  unqfy.addArtist({name:name, country: country, genre:genre});
}

function deleteArtist(unqfy, name) {
  unqfy.deleteArtist({name: name});
}

function addAlbum(unqfy, artistName, name, year, genre){
  const artist = unqfy.artists.find(artist => artist.name === artistName);
  unqfy.addAlbum(artist.id, {name:name, year: year, genre: genre, author: artist.name});
}

// function deleteAlbum(unqfy, artistName) 

function addTrack(unqfy, artistName, albumName, name, duration, genres) {
  const artist = unqfy.artists.find(artist => artist.name === artistName);
  const album = artist.albumes.find(album => album.name === albumName);
  unqfy.addTrack(album.id, {name: name, duration: duration, genres: genres, author: artist.name});
}

function main() {
  console.log('arguments:');
  const arguments_ = process.argv.splice(2);
  const unqfy = getUNQfy();
  if (arguments_[0] === "addArtist"){
    addArtist(unqfy, arguments_[1], arguments_[2], arguments_[3]);
  } else if (arguments_[0] === "addAlbum") {
    addAlbum(unqfy, arguments_[1], arguments_[2], arguments_[3], arguments_[4]);
  } else if (arguments_[0] === "addTrack") {
    addTrack(unqfy, arguments_[1], arguments_[2], arguments_[3], arguments_[4], arguments_[5]);
  } else if (arguments_[0] === "deleteArtist") {
    deleteArtist(unqfy, arguments_[1]);
  }

  saveUNQfy(unqfy);
}

main();
