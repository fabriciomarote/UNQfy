class AlbumError extends Error {
    constructor() {
        super();
        this.name = "AlbumError";
    }
}

module.exports = AlbumError;
