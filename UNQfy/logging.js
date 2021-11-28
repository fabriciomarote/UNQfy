const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const winston  = require('winston');
const {Loggly} = require('winston-loggly-bulk');

class Logging {

    sendNotify(message, type) {
        return fetch('http://localhost:3000/api/notify',{
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