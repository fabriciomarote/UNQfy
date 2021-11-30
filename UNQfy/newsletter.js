const GMailAPIClient = require('./gmail_tools/get-token/GMailAPIClient');

class Newsletter {

    constructor(){
        this.subscribers = [];
    }

    addSubscriber(subscriber) {
        if(!this.hasSubscriber(subscriber)) {
            this.subscribers.push(subscriber);
        }  
    }   

    hasSubscriber(subscriber){
        return this.subscribers.some(subs => subs === subscriber);
    }
    
    hasSubscriberToArtist(artistId, email) {
        const subscribers = this.subscribers.filter( subscriber => subscriber.artistId === artistId);
        return subscribers.some(subscriber => subscriber.email === email);
    }

    hasEmail(email){
        return this.subscribers.some(subscriber => subscriber.email === email);
    }

    deleteSubscriber(subscriber){
        const pos = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(pos, 1);
    }

    getSubscriber(email, artistId){
        return this.subscribers.find(subscriber => subscriber.email === email && subscriber.artistId === artistId);
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

    sendEmail(receiverEmail, subject, message) {
        console.log(receiverEmail);
        new GMailAPIClient().send_mail(subject, [message] ,
                                        {"name": "" , "email" : receiverEmail},
                                        {"name": "" , "email" :""} );
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