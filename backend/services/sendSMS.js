const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

function sendSMS(){
    twilio.messages.create({
        body: 'Disaster alert! flood in chennai',
        from: process.env.TWILIO_PHONE_NO,
        to: "+916384175358"
    }).then(message => {
        console.log(message);
    })
}

module.exports = sendSMS
