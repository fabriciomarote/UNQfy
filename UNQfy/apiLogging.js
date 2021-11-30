const express = require('express');
const fs = require('fs');

const winston  = require('winston');
const {Loggly} = require('winston-loggly-bulk');

const port = process.env.PORT || 4000;
const app = express();
const logs = express();

const {InvalidURLError} = require('./errors'); 

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof InvalidURLError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else {
      // continua con el manejador de errores por defecto
      next(err);
    }
  }

let isActive = true;

app.use(express.json());

app.use('/api', logs);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

function sendLog(msg, type){
    winston.add(new Loggly({
    token: "f066c974-c1da-43ed-9073-c116dcaea9e5",
    subdomain: "enadialopez",
    tags: ["Winston-NodeJS"],
    json: true
    }));
    winston.log(type, msg);
}

function saveLog(message, type) {
    const contenido = message + ":" + type;
    fs.appendFileSync('archivo.txt', contenido); //cambiar este nombre
}

logs.route('/active')
.get((req, res) => {
    if (!isActive){
        isActive = !isActive;
        res.status(200).json({"message" : "The service has been activated"});
    } else {
        res.status(200).json({"message" : "The service is already activated"});
    }
});
logs.route('/dissable')
.get((req, res) => {
    if (isActive){
        isActive = !isActive;
        res.status(200).json({"message" : "The service has been dissabled"});
    } else {
        res.status(200).json({"message" : "The service is already dissabled"});
    }
});

logs.route('/log')
.post((req, res) => {
    if(isActive) {
        const body = {  message: req.body.message, 
                        type: req.body.type };
        sendLog(body.message, body.type);
        saveLog(body.message, body.type);
        res.status(200).json({});
    } else {
        res.status(400).json({"message" :"Cannot send a log since the service is dissabled"});
    }
});

logs.route('/log')
.post((req, res) => {
        console.log(req.body);
        const body = {
                        message: req.body.message, 
                        type: req.body.type
                    };
        sendLog(body.message, body.type);
        saveLog(body.message, body.type);
        res.status(200).res.json({});
});

app.use('*', function(req, res, next) {
    next ( new InvalidURLError());
});

app.use(errorHandler);