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

const ON = true;

const OFF = false;

const statusService = {
    statusUnqfy : OFF,
    statusLogging : OFF,
    statusNewsletter : OFF
};

let isActive = false; 

app.use(express.json());

app.use('/api', monitor);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

const serviceLogging = new Monitor2({
    website: 'http://localhost:4000/api',
    title: 'Logging',
    interval: 0.3, // seconds
});

const serviceNewsletter = new Monitor2({
    website: 'http://localhost:3000/api',
    title: 'Newsletter',
    interval: 0.3, // seconds
});

const serviceUNQfy = new Monitor2({
    website: 'http://localhost:8080/api',
    title: 'UNQfy',
    interval: 0.3, // seconds
});

function services(service){
        service.on('down', function (res, state) {
            getMonitor().send(new Date().toLocaleTimeString() + ' The service ' + service.title + ' is back to normal');
            setStatus(service.title, ON);
        });
        service.on('error', function (error, res) {
            getMonitor().send(new Date().toLocaleTimeString() + ' The service ' + service.title + ' has stopped working');
            setStatus(service.title, OFF);
        }); 
}

function setStatus(title, status){
    if (title === "Newsletter"){
        statusService.statusNewsletter = status;
    } else if (title === "Logging"){
        statusService.statusLogging = status;
    } else if (title === "UNQfy"){
        statusService.statusUnqfy = status;
    }
}

function isAlive (){
    if (isActive){
        services(serviceLogging);
        services(serviceNewsletter);
        services(serviceUNQfy);
    }
}

monitor.route('/stateServices')
.get((req, res) => { 
    if(isActive){
        res.status(200).json(statusService);
    } else {
        res.status(500).json({"message" : "Failure, the service is disabled"});
    }   
});

monitor.route('/active')
.get((req, res) => {
        isActive = true;
        isAlive();
        res.status(200).json({"message" : "The service has been activated"});
});

monitor.route('/dissable')
.get((req, res) => {
    isActive = false;
    isAlive();
    res.status(200).json({"message" : "The service has been dissabled"});
});

app.use('*', function(req, res, next) {
    next (new InvalidURLError());
});

app.use(errorHandler);