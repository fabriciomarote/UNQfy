const express = require('express');
const Monitor = require('./monitor');
const Monitor2 = require('ping-monitor');

const port = process.env.PORT || 5000;
const app = express();
const monitor = express();

function getMonitor() {
    const monitor = new Monitor();
    return monitor;
}

const { errorHandler, InvalidURLError} = require('./errors');
const statusService = {
    statusUnqfy : "off",
    statusLogging : "off",
    statusNewsletter : "off"
};

let isActive = true; 

app.use(express.json());

app.use('/api', monitor);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

/*const servicioLogging = new Monitor2({
    website: 'http://localhost:4000/api',
    title: 'Log',
    interval: 0.30, // seconds
});

const servicioNewsletter = new Monitor2({
    website: 'http://localhost:3000/api',
    title: 'Newsletter',
    interval: 1, // seconds
});

const servicioUNQfy = new Monitor2({
    website: 'http://localhost:8080/api',
    title: 'UNQfy',
    interval: 1, // seconds
});*/

function servicioON(servicio, status){
    servicio.on('down', function (res, state) {
        getMonitor().send(new Date().toLocaleTimeString() + ' El servicio ' + servicio.title + ' ha vuelto a la normalidad');
        status = "on";
    });
}

function servicioOFF(servicio, status){
    servicio.on('error', function (error, res) {
        getMonitor().send(new Date().toLocaleTimeString() + ' El servicio ' + servicio.title + ' ha dejado de funcionar');
        status = "off";
    });
}

function runMonitor (){
    if (isActive){
        servicioON(servicioLogging, statusService.statusLogging);
        servicioON(servicioNewsletter, statusService.statusNewsletter);
        servicioON(servicioUNQfy, statusService.statusUNQfy);

        servicioOFF(servicioLogging, statusService.statusLogging);
        servicioOFF(servicioNewsletter, statusService.statusNewsletter);
        servicioOFF(servicioUNQfy, statusService.statusUNQfy);
    }
}

//runMonitor();

monitor.route('/stateServices')
.get((req, res) => { 
    if(isActive){
        res.status(200).json(statusService);
    } else {
        res.status(500).json("The service has been dissabled");
    }   
});

monitor.route('/active')
.get((req, res) => {
    if (!isActive){
        isActive = !isActive;
        res.status(200).json("The service has been activated");
    } else {
        res.status(200).json("The service is already activated");
    }
});

monitor.route('/dissable')
.get((req, res) => {
    if (isActive){
        isActive = !isActive;
        res.status(200).json("The service has been dissabled");
    } else {
        res.status(500).json("The service is already dissabled");
    }
});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);