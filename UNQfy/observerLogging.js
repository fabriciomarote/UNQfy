const IObserver = require('./iObserver');
const Album = require('./Album');


class ObserverLogging extends IObserver{

    constructor() {
        this.newsletter = new Newslatter;
    }

    notify(param) {
        if(param === Album) {
            
        }
    }

}

module.exports = ObserverLogging;