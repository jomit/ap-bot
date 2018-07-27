(function (invoiceinquiries) {

    var messagebus = require("./messagebus");
    var logger = require("./logger");
    var helper = require("./helper");
    var messageTypes = require("./messagetypes").messageTypes;
    
    invoiceinquiries.getPaymentStatus = function (invoiceNumber, vendorName, msg, callback) {
        msg.invoiceNumber = invoiceNumber;
        msg.vendorName = vendorName;
        msg.messageType = messageTypes.paymentStatus;

        messagebus.sendMessage(msg, callback);
    };

    invoiceinquiries.getPOStatus = function (poNumber, msg, callback) {
        msg.poNumber = poNumber;
        msg.messageType = messageTypes.poStatus;

        messagebus.sendMessage(msg, callback);
    };

    invoiceinquiries.getInvoiceCopy = function (invoiceNumber, vendorName, msg, callback) {
        msg.invoiceNumber = invoiceNumber;
        msg.vendorName = vendorName;
        msg.messageType = messageTypes.invoiceCopy;

        messagebus.sendMessage(msg, callback);
    };
    
})(module.exports);