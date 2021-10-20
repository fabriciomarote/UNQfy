const express = require('express');
const rootApp = express();
const artists = express();
const albums = express();
const tracks = express();
const unqfy = require('./unqfy');

artists.route('/artists')
.get((req, res) => {

})
.post((req, res) => {
});

artists.route('/artists/:artistId')
.get((req, res) => {
    const artistId = req.params.artistId;
    const artist = unqfy.getArtistById(artistId);
    res.json(artist);
})
.delete((req, res) => {
})
.patch((req, res) => {
});


albums.route('/albums')
.get((req, res) => {

})
.post((req, res) => {

})

albums.route('/albums/:albumId')
.get((req, res) => {

})
.delete((req, res) => {

})
.patch((req, res) => {

});

tracks.route('/tracks/trackId/lyrics')
.get((req, res) => {

});

rootApp.use('/api', artists, albums, tracks);