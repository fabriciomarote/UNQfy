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

app.use(express.json());

app.use('/api', monitor);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

const myMonitor = new Monitor2({
    website: 'http://localhost:4000/api',
    title: 'apiLogging',
    interval: 0.30, // seconds

    expect: {
        statusCode: 200
      }
});

myMonitor.on('down', function (res, state) {
    new Monitor().send(new Date().toLocaleTimeString() + ' El servicio ' + myMonitor.title + ' ha vuelto a la normalidad');

});

myMonitor.on('error', function (error, res) {
    new Monitor().send(new Date().toLocaleTimeString() + ' El servicio ' + myMonitor.title + ' ha dejado de funcionar');
});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);