const express = require('express');
const Interested = require('./interested');
const fetch = require('cross-fetch');
const { newsletter } = require('./observerNewsletter');

const port = process.env.PORT || 3000;
const app = express();
const subscribers = express();

const {InvalidURLError, BadRequestError, RelatedResourceNotFoundError, InternalServerError, ResourceNotFoundError, ResourceAlreadyExistsError} = require('./errors'); 

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof InvalidURLError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
      // body-parser error para JSON invalido
      res.status(err.status);
      res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    }
    else if (err instanceof BadRequestError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    }
    else if (err instanceof RelatedResourceNotFoundError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});  
    }
    else if (err instanceof ResourceNotFoundError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});  
    }
    else if (err instanceof ResourceAlreadyExistsError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});  
       
    } else {
      // continua con el manejador de errores por defecto
      next(err);
    }
  }

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
.post((req, res, next) =>{
    const body = { artistId: req.body.artistId, email: req.body.email};           
    if(validate(body.artistId) && validate(body.email)) {
        checkArtist(body.artistId)
        .then(response => {
            if (response.status < 400) {
                const interested = new Interested(body.email, body.artistId);
                newsletter.addSubscriber(interested);
                res.status(200).json({});
            }
        }).catch( error => {
            next (new RelatedResourceNotFoundError());
        });
    } else {
        next (new BadRequestError());
    }
});

subscribers.route('/unsubscribe')
.post((req, res, next)=> {
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
                if(newsletter.hasSubscriberToArtist(body.artistId, body.email)){
                    const interested = newsletter.getSubscriber(body.email, body.artistId);
                    newsletter.deleteSubscriber(interested);
                    res.status(200).json({});
                }else {
                    res.status(response.status).json(response.statusText);
                }
            })
            .catch( error => {
                next (new RelatedResourceNotFoundError());
            });
        } else {
            next (new BadRequestError());
        }
});

subscribers.route('/notify')
.post((req, res, next) => {
    const body = {  artistId: req.body.artistId,
                    subject: req.body.subject,
                    message: req.body.message}; 
    if(validate(body.artistId) && validate(body.subject) && validate(body.message)){
        checkArtist(body.artistId)
        .then(response =>{
            if (response.status < 400) {
                if (newsletter.getEmailsSubscribersByArtist(body.artistId).length !== 0) {
                    newsletter.getEmailsSubscribersByArtist(body.artistId).forEach( receiverEmail => {
                        newsletter.sendEmail(receiverEmail, body.subject, body.message);
                    });    
                    res.status(200).json({});
                } else {
                    next (new InternalServerError());
                }
            } else {
                next (new RelatedResourceNotFoundError());
            }
        })
        .catch( error => {
            next (new InternalServerError());
        });
    }else{
        next (new BadRequestError());
    }
});

subscribers.route('/subscriptions')
.get((req, res, next) => {
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
                next (new RelatedResourceNotFoundError());
            }
        })
        .catch(error => console.log(error));        
    } else {
        next (new BadRequestError());
    }  
})
.delete((req, res, next) => {
    const body = {artistId: req.body.artistId};
    if(validate(body.artistId)) {
        checkArtist(body.artistId)
        .then(response => {
            if (response.status < 400){
                newsletter.deleteInterested(body.artistId);
                res.status(200).json({});
            }else{
                next (new RelatedResourceNotFoundError());
            }
        })
        .catch(error => {
            next (new RelatedResourceNotFoundError());
        });
    } else {
        next(new BadRequestError());
    }      
});

app.use('*', function(req, res, next) {
    next ( new InvalidURLError());
});

app.use(errorHandler);

