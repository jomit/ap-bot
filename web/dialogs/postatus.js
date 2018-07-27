(function (postatus) {

    const builder = require('botbuilder');
    const invoiceinquiries = require("../invoiceinquiries");
    const helper = require("../helper");
    const servicenow = require("../servicenow");
    const sqlTraceLogger = require('../analytics/sqlTraceLogger');
    const util = require("util");

    postatus.init = function (bot) {
        bot.dialog('POStatusDialog',
            (session, args) => {
                helper.stopIdleTimeout();
                var requestStartTime = new Date().toISOString();
                var poEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'PONumber');
                if (!poEntity) {
                    session.send('ERROR: Cannot extract PONumber');
                    session.endDialog();
                } else {
                    var poNumber = poEntity.entity;
                    session.send('Finding PO status ...');
                    var defaultMessage = helper.generateDefaultMessage(session);
                    invoiceinquiries.getPOStatus(poNumber, defaultMessage, async function (result) {
                        if (result.status) {
                            await sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = util.format('The PO status for %s is %s', poNumber, result.status);
                            await servicenow.createOrUpdateTicket(replyMessage, session, true);
                            session.send(replyMessage);
                        } else {
                            if (result.timeout) {
                                await sqlTraceLogger.log(result, requestStartTime);
                                var replyMessage = 'Sorry, we are unable to receive messages from the server at this time. Please try again later';
                                await servicenow.createOrUpdateTicket(replyMessage, session, true);
                                session.send(replyMessage);
                                console.log(session.conversationData);
                            } else {
                                await sqlTraceLogger.log(result, requestStartTime);
                                var replyMessage = util.format('We are unable to find PO status for %s at this time. \n Please try again later or provide a different PO number', poNumber);
                                await servicenow.createOrUpdateTicket(replyMessage, session, true);
                                session.send(replyMessage);
                            }
                        }
                        session.endDialog();
                        helper.startIdleTimeout(session);
                    });
                }

            }
        ).triggerAction({
            matches: 'POStatus'
        });
    };
})(module.exports);

