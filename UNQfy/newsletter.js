
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

    notify(artistName, albumName) {
        const subscribers = this.subscribers.filter((subscriber, artist) => artist === artistName);
        subscribers.forEach( (subscriber, artist) => subscriber)
    }

}


module.exports = Newsletter;