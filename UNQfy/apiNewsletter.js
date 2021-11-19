const { application } = require('express');
const express = require('express');
const Newsletter = require('./newsletter');
const fetch = require('cross-fetch');

const { errorHandler, InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError} = require('./errors');
const port = process.env.PORT || 3000;
const app = express();
const subscribers = express();

function getNewsletter() {
    let newsletter = new Newsletter();
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
            const artist = fetch(`https://localhost:8080/api/artists/:${body.artistId}`);
            artist.then(response => {
                console.log("Se cumplio la primera sigue la segunda");
            })
            .then( artists => {
                console.log("cumple la promesa");
                const artist = JSON.parse(response);
                const interested = new Interested(body.email, artist.name);
                newsletter.addSubscriber(interested);
                return res.status(200).json({artists});
                })
            .catch(error => console.log(error));
        }else {
            const badRequest = new BadRequestError();
            return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }
});

subscribers.route('/unsuscribe')
.post((req, res)=> {
    const body = {artistId: req.body.artistId,
                  email:req.body.email};
    if(body.artistId !== undefined && body.email !== undefined){
        fetch(`https://localhost:8080/api/artists/:${body.artistId}`)
        .then(response => {
            if(newsletter.hasEmail(body.email)){
                const interested = newsletter.getSubscriber(body.email);
                newsletter.deleteSubscriber(interested);
                return res.status(200).json({});
            }
        })
        .catch(error => console.log(error));
    }else{
        const badRequest = new BadRequestError();
        return res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }
});

app.use(errorHandler);

