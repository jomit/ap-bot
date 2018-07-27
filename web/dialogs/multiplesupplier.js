(function (multiplesupplier) {

    const builder = require('botbuilder');
    const helper = require("../helper");
    multiplesupplier.init = function (bot) {
        bot.dialog('MultipleSupplierDialog', [
            (session, args, next) => {
                helper.stopIdleTimeout();
                helper.saveInSession(session,"multisupplierdata",args);
                var choiceString = "";
                args.multipleSuppliers.forEach(element => {
                    choiceString += element.SupplierName + "|"
                });
                session.send('Multiple vendors found with similar name.');
                builder.Prompts.choice(session, "Please select your Vendor from below list. If you cannot find your Vendor Name, please try again later or provide a different invoice number and/or vendor name",
                    choiceString.slice(0, -1), { listStyle: builder.ListStyle.button });
                helper.startIdleTimeout(session);
            },
            async (session, results, next) => {
                helper.stopIdleTimeout();
                var args = helper.getFromSession(session,"multisupplierdata");
                if (results.response) {
                    args.vendorName = results.response.entity;
                    session.beginDialog(args.returnDialog, args);
                } else {
                    await sqlTraceLogger.log(args, new Date().toISOString());
                    session.send("Ok. Please try again later or provide a different invoice number and/or vendor name to find payment status.")
                    session.endDialog();
                    helper.startIdleTimeout(session);
                }
            }
        ]);
    };
})(module.exports);

