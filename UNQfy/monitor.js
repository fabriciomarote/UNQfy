const fetch = require('cross-fetch');

class Monitor {

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
}

module.exports = Monitor;