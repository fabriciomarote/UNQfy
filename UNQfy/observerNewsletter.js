const IObserver = require('./iObserver');
const album = require('./Album');
const Newsletter = require('./newsletter');
const newsletter = new Newsletter();

class ObserverNewsletter extends IObserver{

    notify(param) {
        if(param === album) {
            newsletter.notify(album.author, album.name);
        }
    }

}

module.exports = ObserverNewsletter;