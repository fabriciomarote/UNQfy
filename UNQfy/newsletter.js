
class Newsletter {

    constructor(){
        this.subscribers = [];
    }

    addSubscriber(suscriber, artist) {
        const pair = (suscriber, artist);
        this.subscribers.push(pair);
        console.log(this.subscribers);
    }        

    notify(artistName, albumName) {
        const subscribers = this.subscribers.filter((subscriber, artist) => artist === artistName);
        subscribers.forEach( (subscriber, artist) => subscriber)
    }

}


module.exports = Newsletter;