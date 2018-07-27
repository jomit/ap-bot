(function (humanhandoff) {

    const builder = require('botbuilder');
    const servicenow = require('../servicenow');
    const helper = require("../helper");

    humanhandoff.init = function (bot) {
        bot.dialog('HumanHandoffDialog', [
            (session, args, next) => {
                helper.stopIdleTimeout();
                builder.Prompts.choice(session, "Would you like to talk to a Human ?", "Yes|No", { listStyle: builder.ListStyle.button });
            },
            async (session, results, next) => {
                if (results.response && results.response.entity == 'Yes') {                    
                    var replyText = "User requested for a human handoff, so updating ticket assignment.";
                    await servicenow.assignTicket(replyText, session);
                    session.send("Ok. I have submitted your Ticket : " + helper.getServiceNowTicketNumber(session) + " to a human");
                    session.userData = {};
                    session.conversationData = {};
                    session.endDialog();
                } else{
                    var replyText = "User declined human handoff, so resolving this ticket.";
                    await servicenow.resolveTicket(replyText, session);
                    session.send("Ok. Is there anything else I can help you with ?");
                    session.endDialog();
                }
            }
        ]
        ).triggerAction({
            matches: 'HumanHandoff'
        });
    };
})(module.exports);

