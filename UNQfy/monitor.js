const fetch = require('cross-fetch');
const Ping = require('ping-monitor');
//const { isActive } = require('./apiMonitor');

const OFF = false;

const serviceLogging = new Ping({
    website: 'http://localhost:4000/api',
    title: 'Logging',
    interval: 0.3, // seconds
});

const serviceNewsletter = new Ping({
    website: 'http://localhost:3000/api',
    title: 'Newsletter',
    interval: 0.3, // seconds
});

const serviceUNQfy = new Ping({
    website: 'http://localhost:8080/api',
    title: 'UNQfy',
    interval: 0.3, // seconds
});

class Monitor {
    
    constructor() {
        this.statusServices = {
                            statusUnqfy : OFF,
                            statusLogging : OFF,
                            statusNewsletter : OFF
                            };
    }   

    serviceLogging() {
        const serviceLogging = new Ping({
            website: 'http://localhost:4000/api',
            title: 'Logging',
            interval: 0.3, // seconds
        });
        return serviceLogging;
    }

    serviceNewsletter() {
        const serviceNewsletter = new Ping({
            website: 'http://localhost:3000/api',
            title: 'Newsletter',
            interval: 0.3, // seconds
        });
        return serviceNewsletter;
    }

    serviceUNQfy() {
        const serviceUNQfy = new Ping({
            website: 'http://localhost:8080/api',
            title: 'UNQfy',
            interval: 0.3, // seconds
        });        
        return serviceUNQfy;
    }
    

    send(message) {
        return fetch('https://discord.com/api/webhooks/907744313620975676/9ZiMdG0dDEuhlJJysjLD1ix0upH5WTCnSjxnFrxBpFLtCtY_t3DRQST_4j_0b8xzRjds', {
        method: 'POST',
            body: JSON.stringify({
                content: message,       
            }),
            headers: {
                'Content-Type' : 'application/json'
            } 
        });
    }
    
    setStatus(title, status){
        if (title === "Newsletter"){
            this.statusServices.statusNewsletter = status;
        } else if (title === "Logging"){
            this.statusServices.statusLogging = status;
        } else if (title === "UNQfy"){
            this.statusServices.statusUnqfy = status;
        }
    }

    
}

module.exports = {Monitor,
                  serviceLogging,
                  serviceNewsletter,
                  serviceUNQfy};