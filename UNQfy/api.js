const express = require('express');
const rootApp = express();
const artists = express();
const albums = express();
const tracks = express();
const unqfy = require('./unqfy');

let port = process.env.PORT || 8080

artists.route('/artists')
.get((req, res) => {

})
.post((req, res) => {
});

artists.route('/artists/:artistId')
.get((req, res) => {
    const artistId = req.params.artistId;
    const artist = unqfy.getArtistById(artistId);
    res.status(200).json(artist);
})
.delete((req, res) => {
    const artistId = req.params.artistId;
    const artist = unqfy.getArtistById(artistId);
    unqfy.deleteArtist(artist);
    res.status(204);co
     
})
.patch((req, res) => {
});


albums.route('/albums')
.post((req, res) => {

})

albums.route('/albums/search')
.get((req, res) => {
    const albumName =  req.query;
    
})

albums.route('/albums/:albumId')
.get((req, res) => {
    const albumId = req.params.albumId;
    const album = unqfy.getAlbumById(albumId);
    res.status(200).json(album);

})
.delete((req, res) => {
    const albumId = req.params.albumId;
    const album = unqfy.getAlbumById(albumId);
    unqfy.deleteAlbum(album);
    res.status(204)
})
.patch((req, res) => {

});

tracks.route('/tracks/trackId/lyrics')
.get((req, res) => {

});

rootApp.use('/api', artists, albums, tracks);