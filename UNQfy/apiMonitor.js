const express = require('express');
const Logging = require('../logging');
const Interested = require('../interested');
const fetch = require('cross-fetch');

const port = process.env.PORT || 5000;
const app = express();
const subscribers = express();

function getMonitor() {
    const monitor = new Monitor();
    return monitor;
}

const { errorHandler, InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError} = require('../errors');
const { ErrorResponse, DuplicatedError } = require('../responses');  
const monitor = getMonitor();

app.use(express.json());

app.use('/api', subscribers);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);




app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);