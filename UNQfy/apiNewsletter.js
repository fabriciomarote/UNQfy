const express = require('express');
const Newsletter = require('./newsletter');
const Interested = require('./interested');
const fetch = require('cross-fetch');

const { errorHandler, InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError} = require('./errors');
const port = process.env.PORT || 3000;
const app = express();
const subscribers = express();

function getNewsletter() {
    const newsletter = new Newsletter();
    return newsletter;
}
  
const newsletter = getNewsletter();

app.use(express.json());

app.use('/api', subscribers);

app.listen(port,
    () => console.log(`Puerto ${port} Ok`)
);

subscribers.route('/subscribe')
.post((req, res) =>{
        const body = {artistId: req.body.artistId,
                      email:req.body.email};
        if(body.artistId !== undefined && body.email !== undefined){
            console.log("entra en la promesa");
            fetch(`https://localhost:8080/api/artists/:${body.artistId}`)
            .then(response => {
                console.log("cumple la promesa");
                const interested = new Interested(body.email, body.artistId);
                newsletter.addSubscriber(interested);
                return res.status(200).json({});
                })
            .catch(error => res.status(error.status).json(error.errorCode));
        } else {
            const badRequest = new BadRequestError();
            return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }
});

subscribers.route('/unsuscribe')
.post((req, res)=> {
    const body = {artistId: req.body.artistId,
                  email: req.body.email};
    if(body.artistId !== undefined && body.email !== undefined){
        fetch(`https://localhost:8080/api/artists/:${body.artistId}`)
        .then(response => {
            if(newsletter.hasEmail(body.email)){
                const interested = newsletter.getSubscriber(body.email);
                newsletter.deleteSubscriber(interested);
                return res.status(200).json({});
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
    return 0;
    }
});

subscribers.route('/subscriptions?:artistId=artistID')
.get((req, res) => {
    const artistId = req.params.artistId;
    if(artistId !== undefined) {
        fetch(`https://localhost:8080/api/artists/:${artistId}`)
            .then(response => {
                const emails = newsletter.getSubscribersByArtist(artistId);
                const resBody = {
                    artistId: artistId, 
                    subscriptors: emails 
                };
                res.status(200).json(resBody);
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
        fetch(`https://localhost:8080/api/artists/:${body.artistId}`)
        .then(response => {
            newsletter.deleteInterested(body.artistId);
            res.status(200).json({});
        })
        .catch(error => res.status(error.status).json(error.errorCode));
    } else {
        const badRequest = new BadRequestError();
        return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }      
});

app.use(errorHandler);