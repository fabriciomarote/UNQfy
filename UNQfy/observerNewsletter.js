const IObserver = require('./iObserver');
const Newsletter = require('./newsletter');
const newsletter = new Newsletter();
const fetch = require('cross-fetch');

class ObserverNewsletter extends IObserver{

    notify(nameFunction, data) {
        if(nameFunction === "addAlbum") {
         return this.notifyUser(
                data.artist.id,
                'enadialopez@gmail.com',
                `New Album for ${data.artist.name}`,
                `Hi! The artist ${data.artist.name} add new album called ${data.album.name}`
            );
        } else if (nameFunction === "deleteArtist") {
            this.notifyDeleteArtist();
        }  
    }

    notifyUser(artistId, from, subject, message) {
        return fetch('http://localhost:3000/api/notify',{
            method: 'POST',
            body: JSON.stringify({
                artistId: artistId,
                subject: subject,
                message: message,
                
            }),
            headers: {
                'Content-Type' : 'application/json'
            } 
        });
    }

    notifyDeleteArtist(artistId) {
        newsletter.deleteInterested(artistId);
    }

}

module.exports = ObserverNewsletter;