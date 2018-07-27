(function (dialogs) {

    var greeting = require("./greeting.js");
    var help = require("./help.js");
    var paymentstatus = require("./paymentstatus.js");
    var postatus = require("./postatus.js");
    var invoicecopy = require("./invoicecopy.js");
    var uploadinvoice = require("./uploadinvoice.js");
    var multiplesupplier = require("./multiplesupplier");
    var age = require("./age.js");
    var interestingfact = require("./interestingfact.js");
    var humanhandoff = require("./humanhandoff");

    dialogs.init = function (bot) {
        humanhandoff.init(bot);
        greeting.init(bot);
        help.init(bot);
        paymentstatus.init(bot);
        postatus.init(bot);
        invoicecopy.init(bot);
        uploadinvoice.init(bot);
        multiplesupplier.init(bot);
        age.init(bot);
        interestingfact.init(bot);
    };
})(module.exports);