class ErrorResponse extends Error {
    constructor(msgError) {
        super(msgError);
    }
}
/*
class AlbumError extends Error {
    constructor(msgError) {
        super(msgError);
    }
}

class TrackError extends Error {
    constructor(msgError) {
        super(msgError);
    }
}

module.exports = {
    ArtistError: ArtistError,
    AlbumError: AlbumError,
    TrackError: TrackError,
};

*/

module.exports = ErrorResponse;