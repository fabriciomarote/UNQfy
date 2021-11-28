const express = require('express');

const Monitor = require('ping-monitor');

const port = process.env.PORT || 5000;
const app = express();
const monitor = express();

function getMonitor() {
    const monitor = new Monitor();
    return monitor;
}

const { errorHandler, InvalidURLError} = require('./errors');

app.use(express.json());

app.use('/api', monitor);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

const myMonitor = new Monitor({
    website: 'http://localhost:5000/api',
    title: 'Raging Flame',
    interval: 0.30 // seconds
});

monitor.route('/stateServices')
.get((req, res) => { 

});

monitor.route('/active')
.get((req, res) => { 

});

monitor.route('/desactive')
.get((req, res) => { 

});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);