(function (paymentstatus) {

    const builder = require('botbuilder');
    const invoiceinquiries = require("../invoiceinquiries");
    const helper = require("../helper");
    const servicenow = require("../servicenow");
    const sqlTraceLogger = require('../analytics/sqlTraceLogger');    
    const util = require("util");

    paymentstatus.init = function (bot) {
        bot.dialog('PaymentStatusDialog',
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
                session.send('Finding payment status ...');
                var defaultMessage = helper.generateDefaultMessage(session);
                invoiceinquiries.getPaymentStatus(invoiceNumber, vendorName, defaultMessage, async function (result) {
                    if (result.status) {
                        if (result.multipleSuppliers) {
                            result.returnDialog = "PaymentStatusDialog";
                            session.beginDialog('MultipleSupplierDialog', result);
                        } else {
                            await sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = util.format("The payment status for invoice # %s and %s is %s", invoiceNumber, vendorName, result.status);
                            await servicenow.createOrUpdateTicket(replyMessage,session,true);
                            session.send(replyMessage);
                            session.endDialog();
                            helper.startIdleTimeout(session);
                        }
                    } else {
                        if (result.timeout) {
                            await sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = "Sorry, we are unable to receive messages from the server at this time. Please try again later";
                            await servicenow.createOrUpdateTicket(replyMessage,session,true);
                            session.send(replyMessage);
                            session.endDialog();
                            helper.startIdleTimeout(session);
                        } else {
                            await sqlTraceLogger.log(result, requestStartTime);
                            var replyMessage = util.format("Sorry, we are unable to find payment status for %s and %s at this time.", invoiceNumber, vendorName);
                            await servicenow.createOrUpdateTicket(replyMessage,session,true);
                            session.send(replyMessage);
                            session.beginDialog('UploadInvoiceDialog', result);
                        }
                    }
                });
            }
        ).triggerAction({
            matches: 'PaymentStatus'
        });
    };
})(module.exports);

