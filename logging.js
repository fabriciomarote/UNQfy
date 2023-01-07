const fetch = require('cross-fetch');
class Logging {

    sendLog(message, type) {
        return fetch(`http://localhost:4000/api/log`,{
            method: 'POST',
            body: JSON.stringify({
                message: message, 
                type: type
            }),
            headers: {
                'Content-Type' : 'application/json'
            } 
        });
    }
}

module.exports = Logging;