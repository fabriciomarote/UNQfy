const Generate = require('./generate');
const generateId = new Generate();
class User {
    
    constructor(name) {
        this.id = 'u_' + generateId.generateIdUser();
        this.name = name
        this.listenTracks = []
    }

    listenToATrack(track){
        //¿Como agrego?
        this.listenTracks.add(track);
        
    }
}

module.exports = User