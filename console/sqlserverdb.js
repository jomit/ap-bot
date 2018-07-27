(function (sqlserverdb) {

    var sql = require('mssql');
    var logger = require("./logger");

    sqlserverdb.executeStatement = function(connectionString, sqlQuery, callback) {
        sql.connect(connectionString, function (err) {
            if (err) logger.log(err);
    
            var request = new sql.Request();
            request.query(sqlQuery, function (err, recordset) {
                if (err) console.log(err)
                sql.close();
                callback(recordset);
            });
        });    
    };
})(module.exports);