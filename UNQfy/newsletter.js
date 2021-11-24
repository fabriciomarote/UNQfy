const GMailAPIClient = require('./GMailAPIClient');

class Newsletter {

    constructor(){
        this.subscribers = [];
    }

    addSubscriber(subscriber) {
        if(!this.hasEmail(subscriber.email)) {
            this.subscribers.push(subscriber);
        }  
        console.log(this.subscribers);
    }   
    
    hasEmail(email){
        return this.subscribers.some(subscriber => subscriber.email === email);
    }

    deleteSubscriber(subscriber){
        const subs = this.subscribers.find(subs => subs === subscriber);
        if (subs !== undefined){
            this.subscribers.pop(subs);
        }
        console.log(this.subscribers);
    }

    getSubscriber(email){
        return this.subscribers.find(subscriber => subscriber.email === email);
    }

    getEmailsSubscribersByArtist(artistId) {
        const subsFiltered = [];
        this.subscribers.forEach(subscriber => {
            if(subscriber.artistId === artistId) {
                subsFiltered.push(subscriber.email);
            }
        });
        return subsFiltered;
    }

    notify(artistName, albumName, artistId, subject, message) {
        this.getEmailsSubscribersByArtist(artistId).forEach( receiverEmail => {
            new GMailAPIClient().send_mail(subject, message, {name:"", email: receiverEmail}, {name:"", email: "enadialopez@gmail.com"});
        });
    }

    deleteInterested(artistId) {
        const subscribers = this.subscribers.filter( suscriber => suscriber.artistId === artistId);
        subscribers.forEach(subscriber => {
            const pos = this.subscribers.indexOf(subscriber);
            this.subscribers.splice(pos, 1);
        });
        console.log(this.subscribers);
    }
}

module.exports = Newsletter;