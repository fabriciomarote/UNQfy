const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

let winston  = require('winston');
let {Loggly} = require('winston-loggly-bulk');

function sendLoggin (msj, type){
    winston.add(new Loggly({
    token: "f066c974-c1da-43ed-9073-c116dcaea9e5",
    subdomain: "enadialopez",
    tags: ["Winston-NodeJS"],
    json: true
    }));
    winston.log('info', "Hello World from Api.js!");
}

function saveLogText (msj, type) {
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