(function (invoicecopy) {

    const builder = require('botbuilder');
    const invoiceinquiries = require("../invoiceinquiries");
    const helper = require("../helper");
    const servicenow = require("../servicenow");
    const sqlTraceLogger = require('../analytics/sqlTraceLogger');
    const util = require("util");

    invoicecopy.init = function (bot) {
        bot.dialog('InvoiceCopyDialog',
            (session, args) => {
                helper.stopIdleTimeout();
                var requestStartTime = new Date().toISOString();
                var invoiceNumber = "";
                var vendorName = "";
                if (args.vendorName) {
                    invoiceNumber = args.invoiceNumber;
                    vendorName = args.vendorName;
                } else {
                    var invoiceEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'InvoiceNumber');
                    var vendorEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'VendorName');
                    if (!invoiceEntity || !vendorEntity) {
                        session.send('ERROR: Cannot extract InvoiceNumber and/or VendorName');
                        session.endDialog();
                        return;
                    } else {
                        invoiceNumber = invoiceEntity.entity;
                        vendorName = vendorEntity.entity;
                    }
                }

                session.send('Getting Invoice Copy ...');
                var defaultMessage = helper.generateDefaultMessage(session);
                invoiceinquiries.getInvoiceCopy(invoiceNumber, vendorName, defaultMessage, async function (result) {
                    if (result.downloadLink) {
                        if (result.multipleSuppliers) {
                            result.returnDialog = "InvoiceCopyDialog";
                            session.beginDialog('MultipleSupplierDialog', result);
                        } else {
                            await sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = util.format('Here is the link to download the copy of your invoice : [%s](%s)', invoiceNumber, result.downloadLink);
                            await servicenow.createOrUpdateTicket(replyMessage,session,true);
                            session.send(replyMessage);   
                            session.endDialog();
                            helper.startIdleTimeout(session);        
                        }
                    } else {
                        if (result.timeout) {
                            sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = 'Sorry, we are unable to receive messages from the server at this time. Please try again later';
                            await servicenow.createOrUpdateTicket(replyMessage,session,true);
                            session.send(replyMessage);        
                            session.endDialog();
                        } else {
                            sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = util.format('We are unable to find invoice for %s and %s at this time. \n Please try again later or provide a different invoice number and/or vendor name', invoiceNumber, vendorName);
                            await servicenow.createOrUpdateTicket(replyMessage,session,true);
                            session.send(replyMessage);                                     
                            session.endDialog();
                        }
                        helper.startIdleTimeout(session);
                    }
                });

            }
        ).triggerAction({
            matches: 'InvoiceCopy'
        });

    };
})(module.exports);

