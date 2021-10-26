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

const unqfy = getUNQfy();

const errors = require('./errors');
//const bodyParser = require('body-parser');
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
        try {
            const artistName = req.query.name;
            const artists = unqfy.searchArtistsByName(artistName);
            res.status(200).json(artists);
        }
        catch(error) {
            const errorResponse = {
                status: 400,
                errorCode: "RESOURCE_NOT_FOUND"
            };
            res.status(400).json(errorResponse);
        }
    } else {    
        const artists = unqfy.getArtists();
        res.status(200).json(artists);
    }
})   
.post((req, res) =>{
    try{
        const artistData = {name: req.body.name,
                            country:req.body.country};
        const newArtist = unqfy.addArtist(artistData); 
        unqfy.save('data.json');
        res.status(201).json(newArtist);
    } catch (error) {
        const errorResponse = {
            status: 409,
            errorCode: "RESOURCE_ALREADY_EXISTS"
        };
        res.status(409).json(errorResponse);
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
        unqfy.save('data.json');
        res.status(204).json({});
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404)
        .json(errorResponse);
    }
})
.put((req, res) => {
    try {
        const artistId = req.params.artistId;
        const artistData = { name: req.body.name,
                             country: req.body.country};
        const artistEdited = unqfy.editArtist(artistId, artistData); 
        unqfy.save('data.json');     
        res.status(200).json(artistEdited);               
    } catch(error) {
        res.status(errors.ResourceNotFoundError.status)
        .json({ status : errors.ResourceNotFoundError.status,
                errorCode: errors.ResourceNotFoundError.errorCode});
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
            const errorResponse = {
                status: 404,
                errorCode: "RESOURCE_NOT_FOUND"
            };
            res.status(404).json(errorResponse);
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
        const newAlbum = unqfy.addAlbum(artistId, albumData);
        unqfy.save('data.json');
        res.status(201).json(newAlbum);
    } 
    catch (error) {
        const errorResponse = {
            status: 409,
            errorCode: "RESOURCE_ALREADY_EXISTS"
        };
        res.status(409).json(errorResponse);
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
        const artist = unqfy.getArtistByName(album.author);
        unqfy.deleteAlbum(artist, album);
        unqfy.save('data.json');
        res.status(204).json("Album deleted");
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404)
        .json(errorResponse);
    }
})
.patch((req, res) => {
    try {
        const albumId = req.params.albumId;
        const albumYear = req.body.year;
        const albumEdited = unqfy.editAlbum(albumId, albumYear);    
        unqfy.save('data.json');  
        res.status(200).json(albumEdited);               
    } catch (error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
    }
});
/*
tracks.route('/tracks/:trackId/lyrics')
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
*/
playlists.route('/playlists')
.post((req, res) => {
    try{
        const name = req.body.name;
        const maxDuration = req.body.maxDuration;
        const genres = req.body.genres;
        const newPlaylist = unqfy.createPlaylist(name, genres, maxDuration); 
        unqfy.save('data.json');
        res.status(201).json(newPlaylist);
    } catch (error) {
        const errorResponse = {
            status: 409,
            errorCode: "RESOURCE_ALREADY_EXISTS"
        };
        res.status(409).json(errorResponse);
    } 
})
.post((req, res) => {
    const name = req.body.name;
    const maxDuration = req.body.maxDuration;
    const genres = req.body.name;
    const playlist = unqfy.createPlaylist(name, genres, maxDuration);
    unqfy.save('data.json');
    res.status(201).json(playlist);
});

playlists.route('/playlists')
.get((req, res) => {
    try {
        const playlistName =  req.query.name;
        const playlists = unqfy.searchPlaylistByName(playlistName);
        res.status(200).json(playlists);
    }
    catch(error) {
        const errorResponse = {
            status: 404,
            errorCode: "RESOURCE_NOT_FOUND"
        };
        res.status(404).json(errorResponse);
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

app.use(errors.errorHandler);