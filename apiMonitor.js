const express = require('express');
const { Monitor, serviceLogging, serviceNewsletter, serviceUNQfy } = require('./monitor');

const port = process.env.PORT || 5000;
const app = express();
const monitors = express();

function getMonitor() {
    const monitor = new Monitor();
    return monitor;
  }

const monitor = getMonitor();

const ON = true;
const OFF = false;

const { errorHandler } = require('./errors');

app.use(express.json());

app.use('/api', monitors);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

function isAlive() {
    services(serviceLogging);
    services(serviceNewsletter);
    services(serviceUNQfy);
}

function services(service){
    service.on('down', function (res, state) {
        if (monitor.getIsActive()) {
            monitor.send(new Date().toLocaleTimeString() + ' The service ' + service.title + ' is back to normal');
            monitor.setStatus(service.title, ON);
        }
    });
    service.on('error', function (error, res) {
        if (monitor.getIsActive()) {
            monitor.send(new Date().toLocaleTimeString() + ' The service ' + service.title + ' has stopped working');
            monitor.setStatus(service.title, OFF);
        }
    });  
}

monitors.route('/stateServices')
.get((req, res) => { 
    if(monitor.getIsActive()){
        res.status(200).json(monitor.getStatusServices());
    } else {
        res.status(500).json({"message" : "Failure, the service is disabled"});
    }   
});

monitors.route('/active')
.get((req, res) => {
        monitor.setIsActive(true);
        isAlive();
        res.status(200).json({"message" : "The service has been activated"});
});

monitors.route('/dissable')
.get((req, res) => {
        monitor.setIsActive(false);
    res.status(200).json({"message" : "The service has been dissabled"});
});

app.use(errorHandler);
