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
        console.log(artistId);
        console.log(message);
        fetch('http://localhost:3000/api/notify',{
            method: 'POST',
            body: {
                artistId: artistId,
                from: from,
                subject: subject,
                message: message
            }
        }).then(response => {
            console.log(response);
            if(response.status < 400 ){
                return response.json(); 
            }
        })    
        .then(response => {
            console.log(response);
            newsletter.notify(response.body.artistId, response.body.from, response.body.subject, response.body.message);
        });
    }

    notifyDeleteArtist(artistId) {
        newsletter.deleteInterested(artistId);
    }

}

module.exports = ObserverNewsletter;