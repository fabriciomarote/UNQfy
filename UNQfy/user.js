const Generate = require('./generate');
const generateId = new Generate();

const UNQfy = require('./unqfy');

class User {
    
    constructor(name) {
        this.id = 'u_' + generateId.generateIdUser();
        this.name = name
        this.listenedTracks = []
        this.unqfy = new UNQfy()
    
    }

    listenToA(track){
        this.unqfy.play(track);
        this.listenTracks.push(track);
    }

    listenedTracks(){
        return this.withoutRepeats();
    }

    withoutRepeats (){
        const withoutRepeats =[]
        this.listTracks.forEach(track => {
        if (!this.hasTrack(withoutRepeats, track)) { withoutRepeats.push(track)}
        });
        return withoutRepeats;
    }

    hasTrack(list, aTrack) {
        return list.some(track => track === aTrack);
    }

    amountListen(aTrack) {
        const amount = 0;
        this.listTracks.forEach(track => {
            if (aTrack === track) {amount + 1}
        });
        return amount;
    }

}

module.exports = User