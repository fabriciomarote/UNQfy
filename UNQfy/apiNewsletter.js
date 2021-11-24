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
    //console.log(body.artistId);
    //console.log(body.email);              
    if(body.artistId !== null && body.email !== null) {
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
        if(body.artistId !== undefined && body.email !== undefined) {
            checkArtist(body.artistId)
            .then(response => {
                if(response.status < 400 ){
                    return response.json(); 
                }
            })
            .then( response => {  
                console.log(response);  
                if(newsletter.hasEmail(body.email)){
                    const interested = newsletter.getSubscriber(body.email);
                    console.log(interested);
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
    if(body.artistId !== undefined && body.subject !== undefined && body.message !== undefined){
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
        //res.status(response.status).json(response.statusText);
    }
});

subscribers.route('/subscriptions')
.get((req, res) => {
    const artistId = req.query.artistId;
    console.log(artistId);
    if(artistId !== undefined) {
        checkArtist(artistId).then(response => {
            if (response.status < 400){
                const emails = newsletter.getEmailsSubscribersByArtist(artistId);
                const resBody = {
                    artistId: artistId, 
                    subscriptors: emails 
                };
                if(resBody.artistId !== undefined && resBody.subscriptors !== undefined) {
                    res.status(200).json(resBody);
                } else {
                    const badRequest = new BadRequestError();
                    res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
                }
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
    console.log(body.artistId);
    if(body.artistId !== undefined) {
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