(function (help) {

    const builder = require('botbuilder');
    const helper = require("../helper");

    //help message
    help.init = function (bot) {
        bot.dialog('HelpDialog',
            (session) => {
                helper.stopIdleTimeout();
                var helpMessage = "Hello, I am Contoso AP Bot. Below are a few sample requests that I can help you with: \n\n";
                helpMessage += "To check **Payment status** for an invoice, ask : \n *'What is the payment status for Invoice Number 00000 and Vendor Contoso Inc'* \n";
                helpMessage += "To check **PO status**, ask : \n *'What is the status for PO number 00000'* \n";
                helpMessage += "To get a **Copy of invoice**, ask : \n *'Could I have a copy of Invoice 00000 from Vendor Contoso Inc'* \n";
                session.send(helpMessage);
                session.endDialog();
                helper.startIdleTimeout(session);
            }
        ).triggerAction({
            matches: 'Help'
        });
    };
})(module.exports);

