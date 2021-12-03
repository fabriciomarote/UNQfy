const express = require('express');
const { Monitor, serviceLogging, serviceNewsletter, serviceUNQfy } = require('./monitor');

const port = process.env.PORT || 5000;
const app = express();
const monitors = express();

const monitor = new Monitor();

const ON = true;
const OFF = false;

const { errorHandler, InvalidURLError} = require('./errors');

let isActive = false; 

function isAlive() {
    if (isActive){
        services(serviceLogging);
        services(serviceNewsletter);
        services(serviceUNQfy);
    }
}

function services(service){
    service.on('down', function (res, state) {
        monitor.send(new Date().toLocaleTimeString() + ' The service ' + service.title + ' is back to normal');
        monitor.setStatus(service.title, ON);
    });
    service.on('error', function (error, res) {
        monitor.send(new Date().toLocaleTimeString() + ' The service ' + service.title + ' has stopped working');
        monitor.setStatus(service.title, OFF);
    }); 
}

app.use(express.json());

app.use('/api', monitors);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

monitors.route('/stateServices')
.get((req, res) => { 
    if(isActive){
        res.status(200).json(monitor.statusService);
    } else {
        res.status(500).json({"message" : "Failure, the service is disabled"});
    }   
});

monitors.route('/active')
.get((req, res) => {
        isActive = true;
        isAlive();
        res.status(200).json({"message" : "The service has been activated"});
});

monitors.route('/dissable')
.get((req, res) => {
        isActive = false;
        //isAlive();
    res.status(200).json({"message" : "The service has been dissabled"});
});
/*
app.use('*', function(req, res, next) {
    next (new InvalidURLError());
});*/

app.use(errorHandler);

module.exports = { isActive } ;