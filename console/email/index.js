const authHelper = require('./auth');
const graph = require('@microsoft/microsoft-graph-client');
var logger = require("../logger");
async function replyMessage(msg, callback) {
    var token = await authHelper.getAccessToken();
    var client = graph.Client.init({
        authProvider: (done) => {
            done(null, token.accesstoken);
        }
    });
    var emailBody = "Hello, </br></br>";
    if(msg.messageType == 1) {
        emailBody += "Payment status for " + msg.invoiceNumber + " and vendor " + msg.vendorName + " is : " + msg.status;
    } else if(msg.messageType == 2){
        emailBody += "PO status for " + msg.invoiceNumber + " is : " + msg.status;
    } else if(msg.messageType == 3){
        emailBody += "Here is the link to download the copy of your invoice : <a href='" + msg.downloadLink +"'>" + msg.invoiceNumber + "</a>";
    }
    emailBody += "<br/><br/>Thank you, <br/><br/>Contoso AP Bot"

    const mail = {
        subject: "Ticket " + msg.serviceNowTicketNumber + " has been Resolved",
        toRecipients: [{
            emailAddress: {
                address: msg.replyTo
            }
        }],
        body: {
            content: emailBody,
            contentType: "html"
        }
    }
    await client.api('/users/me/sendMail').post({ message: mail });
    logger.log("=================> Email sent to : " +  msg.replyTo + "\n")
};
exports.replyMessage = replyMessage;

