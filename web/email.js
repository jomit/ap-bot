(function (email) {

    const nodemailer = require('nodemailer');
    var logger = require("./logger");

    email.send = function(mailOptions, callback){
        var transporter = nodemailer.createTransport({
            host: process.env.EmailHost, 
            port: process.env.EmailPort,
            secure: false, 
            auth: {
                user: process.env.EmailUser, 
                pass: process.env.EmailPassword
            }
        });
        mailOptions.to = process.env.EmailTo;
        mailOptions.from = process.env.EmailFrom;

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return logger.logerror(error);
            }
            logger.log('Message sent: ' + info.messageId);
            callback(info.messageId);
        });  
    };
})(module.exports);

