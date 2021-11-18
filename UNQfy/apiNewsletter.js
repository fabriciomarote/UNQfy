const { application } = require('express');
const express = require('express');
const Newsletter = require('./newsletter');
const subscribers = express();

const { errorHandler, InvalidURLError, BadRequestError, ResourceAlreadyExistsError, ResourceNotFoundError, RelatedResourceNotFoundError} = require('./errors');
const port = process.env.PORT || 3000;
const app = express();

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
            fetch(`https://localhost:8080/api/artists/:${body.artistId}`)
            .then(response => {
                const artist = JSON.parse(response);
                const interested = new Interested(body.email, artist.name);
                newsletter.addSubscriber(interested);
                res.status(200).json({});
                })
            .catch(error => console.log(error));
        }else {
            const badRequest = new BadRequestError();
            res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
        }
})

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
                res.status(200).json({});
            }
        })
        .catch(error => console.log(error))
    }else{
        const badRequest = new BadRequestError();
        res.status(badRequest.status).json({status: badRequest.status, errorCode: badRequest.errorCode});
    }
});

app.use(errorHandler);

