
class Newsletter {

    constructor(){
        this.subscribers = [];
    }

    addSubscriber(suscriber) {
        this.subscribers.push(suscriber);
        console.log(this.subscribers);
    }   
    
    deleteSubscriber(suscriber){
        const subs = this.subscribers.find(subs => subs === suscriber);
        if (subs !== undefined){
            this.subscribers.pop(subs);
        }
    }

    hasEmail(email){
        this.subscribers.some(subscriber => subscriber.email === email);
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

    notify(artistName, albumName) {
        const subscribers = this.subscribers.filter((subscriber, artist) => artist === artistName);
        subscribers.forEach( (subscriber, artist) => subscriber);
    }

    deleteInterested(artistId) {
        this.subscribers.forEach(subscriber => {
            if(subscriber.artistId === artistId) {
                const pos = this.subscribers.indexOf(subscriber);
                this.subscribers.splice(pos, 1);
            }
        });
    }

}


module.exports = Newsletter;