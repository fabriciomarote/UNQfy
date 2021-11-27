const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const winston  = require('winston');
const {Loggly} = require('winston-loggly-bulk');

class Logging {

    sendLoggin(type, msg){
        winston.add(new Loggly({
        token: "f066c974-c1da-43ed-9073-c116dcaea9e5",
        subdomain: "enadialopez",
        tags: ["Winston-NodeJS"],
        json: true
        }));
        winston.log(type, msg);
    }

    sendNotify(msg, type) {
        this.sendLoggin(type, msg);
        //saveLogArchive(msg, type);
    }

/*
function saveLogArchive(msj, type) {
    let content = msj + type;
    readFile('archivo', data)
    .then((data) =>{
        //const parseData = JSON.parse(data);
        //console.log(parseData);

        writeFile('logging.text', content)
        .then(() => console.log('Archivo escrito correctamente'));
    })    
    .catch((error) => {
        console.log('Ocurrio un error');
    });
}
*/
}

module.exports = Logging;