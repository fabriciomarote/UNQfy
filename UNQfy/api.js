const express = require('express');
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqfy = require('./unqfy');
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

const unqify = new unqmod.UNQfy();

const errors = require('./errors');
const bodyParser = require('body-parser');
const InvalidInputError = new errors.InvalidInputError();
const app = express();
const artists = express();
const albums = express();
const tracks = express();
const playlists = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api', artists, albums, tracks);
app.listen(port,
    () => console.log(`Puerto ${port} escuchando`)
);

artists.route('/artists')
.post((req, res) => {
    const newArtist = unqify.addArtist(req.body);
    res.status(201).json(newArtist);
});
//e ejemplo = api/artists?name=guns
artists.route('/artists/search')
.get((req, res) => {
    const artistName =  req.query.name;
    const artists = unqify.searchArtistsByName(artistName);
    res.status(200).json(artists);
});

artists.route('/artists/:artistId')
.get((req, res) => {
    const artistId = req.params.artistId;
    const artist = unqify.getArtistById(artistId);
    res.status(200).json(artist);
})
.delete((req, res) => {
    const artistId = req.params.artistId;
    const artist = unqify.getArtistById(artistId);
    unqify.deleteArtist(artist);
    res.status(204);
     
})
.patch((req, res) => {
});


albums.route('/albums')
.post((req, res) => {
    const artistId = req.body.artistId;
    const newAlbum = unqify.addAlbum(artistId, req.body);
    res.status(201).json(newAlbum);
});

albums.route('/albums/search')
.get((req, res) => {
    const albumName =  req.query;
    const albums = unqify.searchAlbumsByName(albumName);
    res.status(200).json(albums);
});

albums.route('/albums/:albumId')
.get((req, res) => {
    const albumId = req.params.albumId;
    const album = unqify.getAlbumById(albumId);
    res.status(200).json(album);
})
.delete((req, res) => {
    const albumId = req.params.albumId;
    const album = unqify.getAlbumById(albumId);
    unqify.deleteAlbum(album);
    res.status(204);
})
.patch((req, res) => {

});

tracks.route('/tracks/trackId/lyrics')
.get((req, res) => {
    const trackId = req.params.trackId;
    if(unqfy.getTracks().some(track => track.id === trackId)) {
        const track = unqfy.getTrackById(trackId);
        const response = {
        Name: track.name,
        lyrics: unqfy.getLyrics(track)
        };

        res.status(200).json(response);
    } else {
        res.status(404);
    }
});

playlists.route('/playlists')
.post((req, res) => {
    
})
.post((req, res) => {
    
})
.get((req, res) => {
    
});

playlists.route('/playlists/:playlistId')
.get((req, res) => {
    const playlistId = req.params.playlistId;
    const playlist = unqfy.getPlaylistById(playlistId);
    res.status(200).json(playlist);
})
.delete((req, res) => {
    const playlistId = req.params.playlistId;
    const playlist = unqfy.getPlaylistById(playlistId);
    unqfy.deleteAlbum(playlist);
    res.status(204);
});

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof InvalidInputError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
      // body-parser error para JSON invalido
      res.status(err.status);
      res.json({status: err.status, errorCode: 'INVALID_JSON'});
    } else {
      // continua con el manejador de errores por defecto
      next(err);
    }
 }
