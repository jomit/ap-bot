var sqlserverdb = require("./sqlserverdb");
var fs = require("fs");
require("dotenv").load();

var invoiceNumber = "11001";
var supplierCode = "149033"
var sqlQuery = "Select InvoiceStatus from AutoInvoiceHeader where InvoiceNumber = "
sqlQuery += "'" + invoiceNumber + "' ";
sqlQuery += "and SupplierCode = '" + supplierCode + "'";
console.log(sqlQuery);

sqlserverdb.executeStatement(process.env.sqledwConnectionString, sqlQuery, function (result) {
    console.log(JSON.stringify(result.recordset));
});