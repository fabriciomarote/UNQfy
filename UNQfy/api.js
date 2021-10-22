const express = require('express');
const fs = require('fs'); // necesitado para guardar/cargar unqfy
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

const unqfy = new unqmod.UNQfy();

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
    () => console.log(`Puerto ${port} Ok`)
);

artists.route('/artists')
.post((req, res) => {
    try{
        const artistData = {name: req.body.name,
                        country:req.body.country};
        const newArtist = unqfy.addArtist(artistData); 
        res.status(201).json(newArtist);
    } catch (error) {
        const errorResponse = {
            status: 409,
            errorCode: "RESOURCE_ALREADY_EXISTS"
        };
        res.status(409).json(errorResponse);
    }
});

artists.route('/artists/search')
.get((req, res) => {
    try {
        const artistName =  req.query.name;
        const artists = unqfy.searchArtistsByName(artistName);
        res.status(200).json(artists);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
});

artists.route('/artists/:artistId')
.get((req, res) => {
    try {
        const artistId = req.params.artistId;
        const artist = unqfy.getArtistById(artistId);
        res.status(200).json(artist);
    } 
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
})
.delete((req, res) => {
    try {
        const artistId = req.params.artistId;
        const artist = unqfy.getArtistById(artistId);
        unqfy.deleteArtist(artist);
        res.status(204);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
     
})
.patch((req, res) => {
});


albums.route('/albums')
.post((req, res) => {
    try {
        const artistId = req.body.artistId;
        const albumData = { name: req.body.name, year: req.body.year};
        const newAlbum = unqfy.addAlbum(artistId, albumData);
        res.status(201).json(newAlbum);
    } 
    catch (error) {
        const errorResponse = {
            status: 404,
            errorCode: "RELATED_RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
});

albums.route('/albums/search')
.get((req, res) => {
    try {
        const albumName =  req.query;
        const albums = unqfy.searchAlbumsByName(albumName);
        res.status(200).json(albums);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
});

albums.route('/albums/:albumId')
.get((req, res) => {
    try {
        const albumId = req.params.albumId;
        const album = unqfy.getAlbumById(albumId);
        res.status(200).json(album);
    }   
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
})
.delete((req, res) => {
    try {
        const albumId = req.params.albumId;
        const album = unqfy.getAlbumById(albumId);
        unqfy.deleteAlbum(album);
        res.status(204);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
})
.patch((req, res) => {

});

tracks.route('/tracks/trackId/lyrics')
.get((req, res) => {
    const trackId = req.params.trackId;
    try {
        if(unqfy.getTracks().some(track => track.id === trackId)) {
            const track = unqfy.getTrackById(trackId);
            const response = {
            name: track.name,
            lyrics: unqfy.getLyrics(track)
            };
            res.status(200).json(response);
           }
        }   
        catch (error) {
            const errorResponse = {
                status: 404,
                errorCode: "RESOURCE_NOT_FOUND"
            };
            res.status(404).json(errorResponse);
        }
});

playlists.route('/playlists')
.post((req, res) => {
    
})
.post((req, res) => {
    
})
.get((req, res) => {
    const name = req.body.name;
    const maxDuration = req.body.maxDuration;
    const genres = req.body.name;
    const playlist = unqfy.createPlaylist(name, genres, maxDuration);
    res.status(201).json(playlist);
});

playlists.route('/playlists/:playlistId')
.get((req, res) => {
    try {
    const playlistId = req.params.playlistId;
    const playlist = unqfy.getPlaylistById(playlistId);
    res.status(200).json(playlist);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
})
.delete((req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const playlist = unqfy.getPlaylistById(playlistId);
        unqfy.deleteAlbum(playlist);
        res.status(204);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
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
