
var messageTypes = {
    paymentStatus: 1,
    poStatus: 2,
    invoiceCopy: 3,
    uploadInvoice: 4
};

function getMessageTypeString(type) {
    if(type ==1){
        return "PaymentStatus";
    } else if(type ==2){
        return "POStatus";
    }else if(type ==3){
        return "InvoiceCopy";
    } else if(type ==4){
        return "UploadInvoice";
    } else{
        return "InvalidType";
    }
};

exports.messageTypes = messageTypes;
exports.getMessageTypeString = getMessageTypeString;