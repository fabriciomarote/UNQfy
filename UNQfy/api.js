const express = require('express');
const { getUNQfy } = require('./main');
const ObserverLogging = require('./observerLogging');
const { ErrorResponse, DuplicatedError } = require('./responses');
const { InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError } = require('./errors');
const observerLogging = new ObserverLogging();
const unqfy = getUNQfy();

unqfy.addObserver(observerLogging);

const app = express();
const artists = express();
const albums = express();
const tracks = express();
const playlists = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/api', artists, albums, tracks);
app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof InvalidURLError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
      // body-parser error para JSON invalido
      res.status(err.status);
      res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    }
    else if (err instanceof BadRequestError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    }
    else if (err instanceof RelatedResourceNotFoundError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});  
    }
    else if (err instanceof ResourceNotFoundError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});  
    }
    else if (err instanceof ResourceAlreadyExistsError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});  
       
    } else {
      // continua con el manejador de errores por defecto
      next(err);
    }
  }

artists.route('/artists')
.get((req, res) => {
    if(req.query.name !== undefined ) {
        const artistName = req.query.name;
        const artists = unqfy.searchArtistsByName(artistName);
        res.status(200).json(artists);
    } else {    
        const artists = unqfy.getArtists();
        res.status(200).json(artists);
    }
})   
.post((req, res, next) =>{
    try{
        const artistData = {name: req.body.name,
                            country:req.body.country};
        if( artistData.name !== undefined && artistData.country !== undefined) {
            const newArtist = unqfy.addArtist(artistData);
            res.status(201).json(newArtist);
        }  else {
            next (new BadRequestError());
        }                    
    } catch (error) {
        next (new ResourceAlreadyExistsError());
    }
});

artists.route('/artists/:artistId')
.get((req, res, next) => {
    try {
        const artistId = req.params.artistId;
        const artist = unqfy.getArtistById(artistId);
        res.status(200).json(artist);
    } 
    catch (error) {
        next (new ResourceNotFoundError());
    }         
})

.delete((req, res, next) => {
    try {
        const artistId = req.params.artistId;
        const artist = unqfy.getArtistById(artistId);
        unqfy.deleteArtist(artist);
        res.status(204).json({});
    }
    catch(error) {
        next (new ResourceNotFoundError());
    }
})

.put((req, res, next) => {
    try {
        const artistId = req.params.artistId;
        const artistData = { name: req.body.name,
                             country: req.body.country};
        if (artistId !== undefined && artistData.name !== undefined && artistData.country !== undefined) {
            const artistEdited = unqfy.editArtist(artistId, artistData);     
            res.status(200).json(artistEdited);    
        } else {
            next (new BadRequestError());
        }               
    } catch(error) {
        next (new ResourceNotFoundError());
    }    
});

albums.route('/albums')
.get((req, res, next) => {
    if(req.query.name !== undefined) {
        try {
            const name =  req.query.name;
            const albums = unqfy.searchAlbumsByName(name);
            res.status(200).json(albums);
        }
        catch(error) {
            next (new ResourceNotFoundError());
        }
    } else {
        const albums = unqfy.getAlbums();
        res.status(200).json(albums);
    }
})  
.post((req, res, next) => {
    try {
        const artistId = req.body.artistId;
        const albumData = { name: req.body.name, year: req.body.year};
        if (albumData.name !== undefined && albumData.year !== undefined && artistId !== undefined) {
            const newAlbum = unqfy.addAlbum(artistId, albumData);
            res.status(201).json(newAlbum);
        } else {
            next (new BadRequestError());
        }
    } 
    catch (error) {
        if (error instanceof ErrorResponse){
            next (new RelatedResourceNotFoundError());
        } else if (error instanceof DuplicatedError ) {
            next (new ResourceAlreadyExistsError());
        }   
    }
});

albums.route('/albums/:albumId')
.get((req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const album = unqfy.getAlbumById(albumId);
        res.status(200).json(album);
    }   
    catch(error) {
        next (new ResourceNotFoundError());
    }
})
.delete((req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const album = unqfy.getAlbumById(albumId);
        const artist = unqfy.getArtistByName(album.author);
        unqfy.deleteAlbum(artist, album);
        res.status(204).json("Album deleted");
    }
    catch(error) {
        next (new ResourceNotFoundError());
    }
})
.patch((req, res, next) => {
    try {
        const albumId = req.params.albumId;
        const albumYear = req.body.year;
        if (albumId !== undefined && albumYear !== undefined) {
            const albumEdited = unqfy.editAlbum(albumId, albumYear); 
            res.status(200).json(albumEdited);  
        } else {
            next (new BadRequestError());
        }            
    } catch (error) {
        next (new ResourceNotFoundError());
    }
});

tracks.route('/tracks')
.get((req, res) => {
        const tracks = unqfy.getTracks();
        res.status(200).json(tracks);
});

tracks.route('/tracks/:trackId')
.get((req, res) => {
        const trackId = (req.params.trackId);
        const track = unqfy.getTrackById(trackId);
        res.status(200).json(track);   
});

tracks.route('/tracks/:trackId/lyrics')
.get((req, res, next) => {
    try {
        const trackId = (req.params.trackId);
        const track = unqfy.getTrackById(trackId);
        unqfy.getLyrics(track).then((lyrics) => {
                 res.status(200).json({ name: track.name, lyrics: lyrics});
         });
    }     
    catch (error) {
        next (new ResourceNotFoundError());
    }
});

playlists.route('/playlists')
.post((req, res, next) => {
    try{
        const name = req.body.name;
        const maxDuration = req.body.maxDuration;
        const genres = req.body.genres;
        if(name !== undefined && maxDuration !== undefined && genres !== undefined) {
            const newPlaylist = unqfy.createPlaylist(name, genres, maxDuration); 
            res.status(201).json(newPlaylist);
        } else {
            next (new BadRequestError());
        }    
    } catch (error) {
        next (new ResourceAlreadyExistsError());
    } 
})
.get((req, res, next) => {
    try {
        const playlistName =  req.query.name;
        const playlists = unqfy.searchPlaylistByName(playlistName);
        res.status(200).json(playlists);
    }
    catch(error) {
        next (new ResourceNotFoundError());
    }
});

playlists.route('/playlists/:playlistId')
.get((req, res, next) => {
    try {
    const playlistId = req.params.playlistId;
    const playlist = unqfy.getPlaylistById(playlistId);
    res.status(200).json(playlist);
    }
    catch(error) {
        next (new ResourceNotFoundError());
    }
})
.delete((req, res, next) => {
    try {
        const playlistId = req.params.playlistId;
        const playlist = unqfy.getPlaylistById(playlistId);
        unqfy.deleteAlbum(playlist);
        res.status(204);
    }
    catch(error) {
        next (new ResourceNotFoundError());
    }
});

/*
app.use('*', function(req, res, next) {
    next (new InvalidURLError());
});*/

app.use(errorHandler);
