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

const unqfy = getUNQfy();

const { errorHandler, InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError} = require('./errors');
const { ErrorResponse, DuplicatedError } = require('./responses');
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
.post((req, res) =>{
    try{
        const artistData = {name: req.body.name,
                            country:req.body.country};
        if( artistData.name !== undefined && artistData.country !== undefined) {
            const newArtist = unqfy.addArtist(artistData); 
            unqfy.save('data.json');
            res.status(201).json(newArtist);
        }  else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }                    
    } catch (error) {
        const resourceAlreadyExistsError = new ResourceAlreadyExistsError();
        res.status(resourceAlreadyExistsError.status).json({status: resourceAlreadyExistsError.status, errorCode: resourceAlreadyExistsError.errorCode});
    }
});

artists.route('/artists/:artistId')
.get((req, res) => {
    try {
        const artistId = req.params.artistId;
        const artist = unqfy.getArtistById(artistId);
        res.status(200).json(artist);
    } 
    catch (error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }
})
.delete((req, res) => {
    try {
        const artistId = req.params.artistId;
        const artist = unqfy.getArtistById(artistId);
        unqfy.deleteArtist(artist);
        unqfy.save('data.json');
        res.status(204).json({});
    }
    catch(error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
}
})
.put((req, res) => {
    try {
        const artistId = req.params.artistId;
        const artistData = { name: req.body.name,
                             country: req.body.country};
        if (artistId !== undefined && artistData.name !== undefined && artistData.country !== undefined) {
            const artistEdited = unqfy.editArtist(artistId, artistData); 
            unqfy.save('data.json');     
            res.status(200).json(artistEdited);    
        } else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }               
    } catch(error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }    
});

albums.route('/albums')
.get((req, res) => {
    if(req.query.name !== undefined) {
        try {
            const name =  req.query.name;
            const albums = unqfy.searchAlbumsByName(name);
            res.status(200).json(albums);
        }
        catch(error) {
            const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
        }
    } else {
        const albums = unqfy.getAlbums();
        res.status(200).json(albums);
    }
})  
.post((req, res) => {
    try {
        const artistId = req.body.artistId;
        const albumData = { name: req.body.name, year: req.body.year};
        if (albumData.name !== undefined && albumData.year !== undefined && artistId !== undefined) {
            const newAlbum = unqfy.addAlbum(artistId, albumData);
            unqfy.save('data.json');
            res.status(201).json(newAlbum);
        } else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }
    } 
    catch (error) {
        if (error instanceof ErrorResponse){
            const relatedResourceNotFoundError = new RelatedResourceNotFoundError();
            res.status(404).json({status: relatedResourceNotFoundError.status, errorCode: relatedResourceNotFoundError.errorCode});   
        } else if (error instanceof DuplicatedError ) {
            const resourceAlreadyExistsError = new ResourceAlreadyExistsError();
            res.status(resourceAlreadyExistsError.status).json({status: resourceAlreadyExistsError.status, errorCode: resourceAlreadyExistsError.errorCode}); 
        }   
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
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }
})
.delete((req, res) => {
    try {
        const albumId = req.params.albumId;
        const album = unqfy.getAlbumById(albumId);
        const artist = unqfy.getArtistByName(album.author);
        unqfy.deleteAlbum(artist, album);
        unqfy.save('data.json');
        res.status(204).json("Album deleted");
    }
    catch(error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }
})
.patch((req, res) => {
    try {
        const albumId = req.params.albumId;
        const albumYear = req.body.year;
        if (albumId !== undefined && albumYear !== undefined) {
            const albumEdited = unqfy.editAlbum(albumId, albumYear);    
            unqfy.save('data.json');  
            res.status(200).json(albumEdited);  
        } else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }            
    } catch (error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
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
.get((req, res) => {
    try {
        const trackId = (req.params.trackId);
        const track = unqfy.getTrackById(trackId);
        unqfy.getLyrics(track).then((lyrics) => {
                 res.status(200).json({ name: track.name, lyrics: lyrics});
         });
    }     
    catch (error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }
});

playlists.route('/playlists')
.post((req, res) => {
    try{
        const name = req.body.name;
        const maxDuration = req.body.maxDuration;
        const genres = req.body.genres;
        if(name !== undefined && maxDuration !== undefined && genres !== undefined) {
            const newPlaylist = unqfy.createPlaylist(name, genres, maxDuration); 
            unqfy.save('data.json');
            res.status(201).json(newPlaylist);
        } else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }    
    } catch (error) {
        const resourceAlreadyExistsError = new ResourceAlreadyExistsError();
        res.status(resourceAlreadyExistsError.status).json({status: resourceAlreadyExistsError.status, errorCode: resourceAlreadyExistsError.errorCode});
    } 
})
.get((req, res) => {
    try {
        const playlistName =  req.query.name;
        const playlists = unqfy.searchPlaylistByName(playlistName);
        res.status(200).json(playlists);
    }
    catch(error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }
});

playlists.route('/playlists/:playlistId')
.get((req, res) => {
    try {
    const playlistId = req.params.playlistId;
    const playlist = unqfy.getPlaylistById(playlistId);
    res.status(200).json(playlist);
    }
    catch(error) {
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
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
        const resourceNotFound = new ResourceNotFoundError();
        res.status(resourceNotFound.status).json({status: resourceNotFound.status, errorCode: resourceNotFound.errorCode});
    }
});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);
