const IObserver = require('./iObserver');
const Logging = require('./logging');
const logging = new Logging();

class ObserverLogging extends IObserver{

    notify(nameFunction, data) {
        if (nameFunction === "addArtist") {
            logging.sendNotify('The new artist '+data.name+' has been added to Unqfy', 'info');
        } else if(nameFunction === "addAlbum") {
            logging.sendNotify('The artist '+data.artist.name+' added the album '+data.album.name, 'info');
        } else if(nameFunction === "addTrack") {
            logging.sendNotify('The artist '+data.author+ 'added the track '+data.name+ 'in the album '+data.album, 'info');
        } else if(nameFunction === "deleteArtist") {
            logging.sendNotify('The artist '+data.name+' has been removed', 'info');
        } else if(nameFunction === "deleteAlbum") {
            logging.sendNotify('The album '+data.album.name+' by the artist '+data.artist.name+' has been removed', 'info');
        } else if(nameFunction === "deleteArtist") {
            logging.sendNotify('the track '+data.name+' from the album '+data.album+' from the artist '+data.author+' has been removed', 'info');  
        }
    }
}

module.exports = ObserverLogging;