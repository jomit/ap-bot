(function (greeting) {

    const servicenow = require('../servicenow');
    const helper = require("../helper");

    greeting.init = function (bot) {
        bot.dialog('GreetingDialog',
            async (session) => {
                helper.stopIdleTimeout();
                var replyText = "Hello, I am Contoso AP Bot. \n How can I help you?";
                await servicenow.createOrUpdateTicket(replyText, session);
                session.send(replyText);
                session.endDialog();
                helper.startIdleTimeout(session);
            }
        ).triggerAction({
            matches: 'Greeting'
        });
    };
})(module.exports);

