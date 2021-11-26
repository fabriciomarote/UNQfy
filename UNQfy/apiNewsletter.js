const express = require('express');
const Newsletter = require('./newsletter');
const Interested = require('./interested');
const fetch = require('cross-fetch');

const port = process.env.PORT || 3000;
const app = express();
const subscribers = express();

function getNewsletter() {
    const newsletter = new Newsletter();
    return newsletter;
}

const { errorHandler, InvalidURLError, BadRequestError, RelatedResourceNotFoundError} = require('./errors'); 
const GMailAPIClient = require('./GMailAPIClient');
const newsletter = getNewsletter();

app.use(express.json());

app.use('/api', subscribers);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

function validate(param) {
    return param !== null && param !== undefined && param.length !== 0;
}

function checkArtist(artistId){
    return fetch(`http://localhost:8080/api/artists/` + artistId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

subscribers.route('/subscribe')
.post((req, res) =>{
    const body = { artistId: req.body.artistId, email: req.body.email};           
    if(validate(body.artistId) && validate(body.email)) {
        checkArtist(body.artistId)
        .then(response => {
            if (response.status < 400) {
                const interested = new Interested(body.email, body.artistId);
                newsletter.addSubscriber(interested);
                res.status(200).json({});
            } else {
                const errorResponse = new RelatedResourceNotFoundError();
                res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
            }
        }).catch( error => {
            console.log(error);
        });
    } else {
        const badRequest = new BadRequestError();
        res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }
});

subscribers.route('/unsubscribe')
.post((req, res)=> {
        const body = {artistId: req.body.artistId,
                    email: req.body.email};
        if(validate(body.artistId) && validate(body.email)) {
            checkArtist(body.artistId)
            .then(response => {
                if(response.status < 400 ){
                    return response.json(); 
                }
            })
            .then( response => {  
                if(newsletter.hasEmail(body.email)){
                    const interested = newsletter.getSubscriber(body.email);
                    newsletter.deleteSubscriber(interested);
                    res.status(200).json({});
                }else {
                    res.status(response.status).json(response.statusText);
                }
            })
            .catch( error => {
                const errorResponse = new RelatedResourceNotFoundError();
                res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
            });
        } else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }
});

subscribers.route('/notify')
.post((req, res) => {
    const body = {  artistId: req.body.artistId,
                    subject: req.body.subject,
                    message: req.body.message}; 
    if(validate(body.artistId) && validate(body.subject) && validate(body.message)){
        checkArtist(body.artistId)
        .then(response =>{
            if (response.status < 400) {
                newsletter.notify(body.artistId, body.subject, body.message);
                res.status(200).json({});
            } else {
                res.status(response.status).json(response.statusText);
            }
        })
        .catch( error => {
            const errorResponse = new RelatedResourceNotFoundError();
            res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
        });
    }else{
        const badRequest = new BadRequestError();
        res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});//res.status(response.status).json(response.statusText);
    }
});

subscribers.route('/subscriptions')
.get((req, res) => {
    const artistId = req.query.artistId;
    if(validate(artistId)) {
        checkArtist(artistId).then(response => {
            if (response.status < 400){
                const emails = newsletter.getEmailsSubscribersByArtist(artistId);
                const resBody = {
                    artistId: artistId, 
                    subscriptors: emails 
                };
                res.status(200).json(resBody);
            }else{
                const errorResponse = new RelatedResourceNotFoundError();
                res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
            }
        })
        .catch(error => console.log(error));        
    } else {
        const badRequest = new BadRequestError();
        res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }  
})
.delete((req, res) => {
    const body = {artistId: req.body.artistId};
    if(validate(body.artistId)) {
        checkArtist(body.artistId)
        .then(response => {
            if (response.status < 400){
                newsletter.deleteInterested(body.artistId);
                res.status(200).json({});
            }else{
                const errorResponse = new RelatedResourceNotFoundError();
                res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
            }
        })
        .catch(error => {
            const errorResponse = new RelatedResourceNotFoundError();
            res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
        });
    } else {
        const badRequest = new BadRequestError();
        res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }      
});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);