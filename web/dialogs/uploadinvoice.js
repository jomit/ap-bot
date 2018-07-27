(function (uploadinvoice) {

    const builder = require('botbuilder');
    var logger = require("../logger");
    var email = require("../email");
    const sqlTraceLogger = require('../analytics/sqlTraceLogger');
    const helper = require("../helper");
    var messageTypes = require("../messagetypes").messageTypes;
    uploadinvoice.init = function (bot) {
        bot.dialog('UploadInvoiceDialog', [
            (session, args, next) => {
                helper.stopIdleTimeout();
                args.messageType = messageTypes.uploadInvoice;
                helper.saveInSession(session,"uploadinvoicedata",args);
                builder.Prompts.choice(session, "Would you like to submit the invoice now?", "Yes|No", { listStyle: builder.ListStyle.button });
                helper.startIdleTimeout(session);
            },
            async (session, results, next) => {
                helper.stopIdleTimeout();
                var args = helper.getFromSession(session,"uploadinvoicedata");
                if (results.response && results.response.entity == 'Yes') {
                    if(args.channel == "web") {
                        builder.Prompts.attachment(session, 'Ok, I can help you with this. Please use the attachment button to upload your invoice:');
                    } else {
                        args.status = "sent";
                        await sqlTraceLogger.log(args, new Date().toISOString());
                        session.send('Click on this link to send of your invoice : mailto:contosoap@outlook.com?subject=My%20Invoice&body=Here%20is%20the%20Invoice');
                        session.endDialog();
                        helper.startIdleTimeout(session);
                    }
                } else {
                    await sqlTraceLogger.log(args, new Date().toISOString());
                    session.send("Ok. Please try again later or provide a different invoice number and/or vendor name to find payment status.")
                    session.endDialog();
                    helper.startIdleTimeout(session);
                }
            },
            (session) => {
                helper.stopIdleTimeout();
                var args = helper.getFromSession(session,"uploadinvoicedata");
                var requestStartTime = new Date().toISOString();
                var msg = session.message;
                if (msg.attachments.length) {
                    var attachment = msg.attachments[0];
                    session.send("Submitting Invoice ... %s", attachment.contentUrl);
                    try {
                        email.send({
                            subject: 'Test Email from Bot',
                            html: '<b>Here is the invoice</b>',
                            attachments: [
                                {
                                    filename: attachment.name,
                                    path: attachment.contentUrl
                                }
                            ]
                        }, async function () {
                            args.status = "sent";
                            await sqlTraceLogger.log(args, requestStartTime);
                            session.send("Your invoice has been submitted to accountspayable@consoto.com. \n I copied you on the email, and you will see the email in your inbox shortly.");
                            session.endDialog();
                            helper.startIdleTimeout(session);
                        });
                    } catch (err) {
                        logger.logerror(err);
                    }
                }
            }
        ]).triggerAction({
            matches: 'UploadInvoice'
        });
    };
})(module.exports);

