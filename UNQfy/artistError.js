class ArtistError extends Error {
    constructor() {
        super('The artist cannot be added because it already exists');
    }
}

module.exports = ArtistError;