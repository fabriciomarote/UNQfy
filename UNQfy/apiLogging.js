const express = require('express');
const Logging = require('./logging');
const fs = require('fs');

const port = process.env.PORT || 4000;
const app = express();
const logs = express();
app.use('/api', logs);

function getLogging() {
    const logging = new Logging();
    return logging;
}

const { errorHandler, InvalidURLError} = require('./errors'); 
const logging = getLogging();
let isActive = true;

app.use(express.json());

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

/*app.route("./active"){
    const body = {  state: req.body.state }
    .post((req, res) => {
        logging.setState(body.state);
    });
});

**/
function sendLog(type, msg){
    winston.add(new Loggly({
    token: "f066c974-c1da-43ed-9073-c116dcaea9e5",
    subdomain: "enadialopez",
    tags: ["Winston-NodeJS"],
    json: true
    }));
    winston.log(type, msg);
}

function saveLog(message, type) {
    let contenido = message + ":" + type;
    fs.appendFileSync('archivo.txt', contenido); //cambiar este nombre
}

function setState(state){
    isActive = state;
}

logs.route('/active')
.get((req, res) => {
    if (!isActive){
        isActive = !isActive;
    }
});

logs.route('/desactive')
.get((req, res) => {
    if (isActive){
        isActive = !isActive;
    }

});

logs.route('/log')
.post((req, res) => {
    console.log("pasa por aca 1");
    if (isActive) {
        console.log(req.body);
        const body = {
                        message: req.body.message, 
                        type: req.body.type
                    };
        sendLog(body.type, body.message);
        saveLog(body.message, body.type);
        console.log("pasa por aca 3");
        res.status(200).res.json({});
    }
    else{
        console.log('Could not send messege to Loggly becouse is unactive');
    }
});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);