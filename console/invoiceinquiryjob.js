(function (invoiceinquiryjob) {

    var sqlserverdb = require("./sqlserverdb");
    var logger = require("./logger");
    var fs = require("fs");

    invoiceinquiryjob.processPaymentStatus = function (requestMessage, callback) {
        var resultMsg = requestMessage;
        logger.log("Recieved Message => " + requestMessage);

        //Get SupplierCode
        var sqlQuery = "Set Transaction Isolation Level Read Uncommitted; ";
        sqlQuery += "Select Distinct Top 10 SupplierCode, [NAME] as [SupplierName] from Supplier ";
        sqlQuery += "WHERE [Name] LIKE '%" + requestMessage.vendorName + "%'";


        sqlserverdb.executeStatement(process.env.sqledwConnectionString, sqlQuery, function (result) {
            if (result.recordset && result.recordset.length > 0) {
                if (result.recordset.length > 1) { // handle scenario with multiple suppliers 
                    resultMsg.status = result.recordset.length;
                    resultMsg.multipleSuppliers = result.recordset;
                    callback(resultMsg);
                }
                else {
                    var supplierCode = result.recordset[0].SupplierCode;
                    logger.log("Supplier Code => " + supplierCode);

                    sqlQuery = "Set Transaction Isolation Level Read Uncommitted; ";
                    sqlQuery += "Select InvoiceStatus from AutoInvoiceHeader where InvoiceNumber = "
                    sqlQuery += "'" + requestMessage.invoiceNumber + "' ";
                    sqlQuery += "and SupplierCode = '" + supplierCode + "'";

                    logger.log(sqlQuery);

                    sqlserverdb.executeStatement(process.env.sqledwConnectionString, sqlQuery, function (result) {
                        //TODO: Need to handle scenario with multiple invoice statuses 
                        if (result.recordset && result.recordset.length > 0) {
                            logger.log("Invoice Status => " + result.recordset[0].InvoiceStatus);
                            resultMsg.status = result.recordset[0].InvoiceStatus;
                        }
                        callback(resultMsg);
                    });
                }
            } else {
                callback(resultMsg);
            }
        });
    };

    invoiceinquiryjob.processPOStatus = function (requestMessage, callback) {
        var resultMsg = requestMessage;
        var sqlQuery = "Set Transaction Isolation Level Read Uncommitted; ";
        sqlQuery += "Select PurchaseOrderStatus from PurchaseOrder where SAPPONumber LIKE ";
        sqlQuery += "'%" + requestMessage.poNumber + "%'";

        sqlserverdb.executeStatement(process.env.sqledwConnectionString, sqlQuery, function (result) {
            if (result.recordset && result.recordset.length > 0) {
                logger.log("PurchaseOrderStatus Status => " + result.recordset[0].PurchaseOrderStatus);
                resultMsg.status = result.recordset[0].PurchaseOrderStatus;
            }
            callback(resultMsg);
        });
    };

    invoiceinquiryjob.processInvoiceCopy = function (requestMessage, callback) {
        // var resultMsg = requestMessage;
        // resultMsg.downloadLink = "https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-3.0"
        // callback(resultMsg);

        var resultMsg = requestMessage;
        logger.log("Recieved Message => " + requestMessage);

        //Get SupplierCode
        var sqlQuery = "Set Transaction Isolation Level Read Uncommitted; ";
        sqlQuery += "Select Distinct Top 10 SupplierCode, [NAME] as [SupplierName] from Supplier ";
        sqlQuery += "WHERE [Name] LIKE '%" + requestMessage.vendorName + "%'";

        sqlserverdb.executeStatement(process.env.sqledwConnectionString, sqlQuery, function (result) {
            if (result.recordset && result.recordset.length > 0) {
                if (result.recordset.length > 1) { // handle scenario with multiple suppliers 
                    resultMsg.downloadLink = result.recordset.length;
                    resultMsg.multipleSuppliers = result.recordset;
                    callback(resultMsg);
                }
                else {
                    var supplierCode = result.recordset[0].SupplierCode;
                    logger.log("Supplier Code => " + supplierCode);

                    sqlQuery = "Set Transaction Isolation Level Read Uncommitted; ";
                    sqlQuery += "Select CONCAT('https://drive.contoso.com/Payables/AttachedDocument?id=',Coalesce([InvoiceNumber],[SupplierCode])) as 'InvoiceURL' from AutoInvoiceHeader ";
                    sqlQuery += "WHERE InvoiceNumber = '" + requestMessage.invoiceNumber + "' and SupplierCode = '" + supplierCode + "'";

                    logger.log(sqlQuery);

                    sqlserverdb.executeStatement(process.env.sqledwConnectionString, sqlQuery, function (result) {
                        if (result.recordset && result.recordset.length > 0) {
                            logger.log("Copy Invoice Link => " + result.recordset[0].InvoiceURL);
                            resultMsg.downloadLink = result.recordset[0].InvoiceURL;
                        }
                        callback(resultMsg);
                    });
                }

            } else {
                callback(resultMsg);
            }
        });
    };
})(module.exports);