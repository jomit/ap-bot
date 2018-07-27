(function (interestingfact) {

    const builder = require('botbuilder');
    const helper = require("../helper");
    const servicenow = require('../servicenow');

    var factList = [
        "A February 26, 2010 Microsoft whitepaper examined 'the potential outcomes of a pilot implementation of Google Apps from the vantage point of a hypothetical company' called Contoso Ltd.",
        "You can follow Contoso on twitter @ContosoInc",
        "On April 1, 2011, an April Fool's Day joke from Google Enterprise said that Contoso abandoned many of Microsoft's technologies in favor of Google Apps. The joke was a response to the 2010 whitepaper listed above. In response to this joke, the Why Microsoft blog responded saying that Contoso was lured back from Google by promises of 'proven cost savings'."
    ];

    interestingfact.init = function (bot) {
        bot.dialog('InterestingFactDialog',
            async (session) => {
                helper.stopIdleTimeout();
                var factno = Math.floor((Math.random() * 5));
                var factMessage = "Interesting Fact about Contoso: ";
                factMessage += factList[factno];
                await servicenow.createOrUpdateTicket(factMessage, session);
                session.send(factMessage);
                session.endDialog();
                helper.startIdleTimeout(session);
            }
        ).triggerAction({
            matches: 'InterestingFact'
        });
    };
})(module.exports);

