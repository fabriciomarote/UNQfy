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

const { errorHandler, InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError} = require('./errors');
const { ErrorResponse, DuplicatedError } = require('./responses');  
const GMailAPIClient = require('./GMailAPIClient');
const newsletter = getNewsletter();

app.use(express.json());

app.use('/api', subscribers);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

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
    try{
        const body = {artistId: req.body.artistId,
                      email:req.body.email};
        if(body.artistId === undefined && body.email === undefined ){
            checkArtist(body.artistId)
            .then(response => {
                if (response.status < 400) {
                    const interested = new Interested(body.email, body.artistId);
                    newsletter.addSubscriber(interested);
                    return res.status(200).json({});
                }else{
                    const errorResponse = new ResourceNotFoundError();
                    return res.status(errorResponse.status).json({status: errorResponse.status, errorCode: errorResponse.errorCode});
                }
            }).catch(error => console.log(error));
        } else {
            const badRequest = new BadRequestError();
            return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }
    } catch (error) {
        const resourceAlreadyExistsError = new ResourceAlreadyExistsError();
        res.status(resourceAlreadyExistsError.status).json({status: resourceAlreadyExistsError.status, errorCode: resourceAlreadyExistsError.errorCode});
    }
});

subscribers.route('/unsuscribe')
.post((req, res)=> {
    const body = {artistId: req.body.artistId,
                  email: req.body.email};
    if(body.artistId !== undefined && body.email !== undefined){
        checkArtist(body.artistId).then(response => {
            if(newsletter.hasEmail(body.email) && response.status < 400 ){
                const interested = newsletter.getSubscriber(body.email);
                newsletter.deleteSubscriber(interested);
                return res.status(200).json({});
            }else{
                res.status(response.status).json(error.errorCode);
            }
        })
        .catch(error => res.status(error.status).json(error.errorCode));
    } else {
        const badRequest = new BadRequestError();
        return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }
});

subscribers.route('/notify')
.post((req, res) => {
    const body = {  artistId: req.body.artistId,
                    subject: req.body.subject,
                    message: req.body.message}; 
    if(body.artistId !== undefined && body.subject !== undefined && body.message !== undefined){
        checkArtist(bosy.artistId).then(response =>{
            if (response.status < 400){
                newsletter.getEmailsSubscribersByArtist(body.artistId).forEach(recipientEmail => 
                new GMailAPIClient().send_mail( body.subject, body.message, recipientEmail, 'enadialopez@gmail.com'));
            } else {
                res.status(response.status).json(errorCode);
            }
        })
        .catch(error => res.status(error.status).json(error.errorCode));
    }else{
        res.status(response.status).json(errorCode);
    }
});

subscribers.route('/subscriptions?:artistId=artistID')
.get((req, res) => {
    const artistId = req.params.artistId;
    if(artistId !== undefined) {
        checkArtist(body.artistId).then(response => {
            if (response.status < 400){
                const emails = newsletter.getSubscribersByArtist(artistId);
                const resBody = {
                    artistId: artistId, 
                    subscriptors: emails 
                };
                res.status(200).json(resBody);
            }else{
                res.status(response.status).json(errorCode);
            }
        })
        .catch(error => res.status(error.status).json(error.errorCode));
    } else {
        const badRequest = new BadRequestError();
        return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }  
});

subscribers.route('/subscriptions')
.delete((req, res) => {
    const body = {artistId: req.body.artistId};
    if(body.artistId !== undefined) {
        checkArtist(body.artistId).then(response => {
            if (response.status < 400){
                newsletter.deleteInterested(body.artistId);
                res.status(200).json({});
            }else{
                res.status(response.status).json(errorCode);
            }
        })
        .catch(error => res.status(error.status).json(error.errorCode));
    } else {
        const badRequest = new BadRequestError();
        return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }      
});

app.use('*', function(req, res) {
    const invalidError = new InvalidURLError();
    res.status(invalidError.status).json({status: invalidError.status, errorCode: invalidError.errorCode});
});

app.use(errorHandler);