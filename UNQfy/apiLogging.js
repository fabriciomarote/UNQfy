const express = require('express');
const Logging = require('./logging');

const port = process.env.PORT || 4000;
const app = express();

function getLogging() {
    const logging = new Logging();
    return logging;
}

const { errorHandler, InvalidURLError} = require('./errors'); 
const logging = getLogging();

app.use(express.json());



app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);




app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);