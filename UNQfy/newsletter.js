const GMailAPIClient = require('./gmail_tools/get-token/GMailAPIClient');
//const gmail = new GMailAPIClient();

class Newsletter {

    constructor(){
        this.subscribers = [
            {email: "fabrii.cai93@gmail.com", artistId: 'ar_1'},
            {email: "enadialopez@gmail.com", artistId: 'ar_1'},
        ];
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

    notify(artistId, from, subject, message) {
        console.log(message);
        console.log(subject);
        console.log(artistId);
        console.log(from);
        this.getEmailsSubscribersByArtist(artistId).forEach( receiverEmail => {
            console.log(receiverEmail);
            //new GMailAPIClient().send_Mail(subject, [message], {"name":"", "email": receiverEmail}, {"name":"", "email": from});
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