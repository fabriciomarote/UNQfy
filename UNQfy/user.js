const Generate = require('./generate');
const generateId = new Generate();

class User {
    constructor(name) {
        this.id = 'u_' + generateId.generateIdUser();
        this.name = name;
        this.listenedTracks = [];
    }

    listenToA(track){
        this.listenTracks.push(track);
        track.sumAmount();
    }

    listenedTracks(){
        return this.withoutRepeats();
    }

    withoutRepeats (){
        const withoutRepeats =[];
        this.listTracks.forEach(track => {
            if (!this.hasTrack(withoutRepeats, track)) { 
                withoutRepeats.push(track);
            }
        });
        return withoutRepeats;
    }

    hasTrack(list, aTrack) {
        return list.some(track => track === aTrack);
    }

    amountListen(aTrack) {
        let amount = 0;
        this.listTracks.forEach(track => {
            if (aTrack === track) {
                amount += 1;
            }
        });
        return amount;
    }

}

module.exports = User;