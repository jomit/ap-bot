(function (age) {

    const builder = require('botbuilder');
    const helper = require("../helper");
    const servicenow = require('../servicenow');

    age.init = function (bot) {
        bot.dialog('AgeDialog',
            async (session) => {
                helper.stopIdleTimeout();
                var replyText = "Age has no meaning because I am virtual. I was created in June 2018, but I think I can pull invoices faster than you.";
                await servicenow.createOrUpdateTicket(replyText, session);
                session.send(replyText);
                session.endDialog();
                helper.startIdleTimeout(session);
            }
        ).triggerAction({
            matches: 'Age'
        });
    };
})(module.exports);

