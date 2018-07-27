(function (sqlTraceLogger) {

    var sql = require('mssql');
    var logger = require('../logger');
    var messageTypes = require("../messagetypes");
    require("dotenv").load();

    sqlTraceLogger.traceStatus = {
        Resolved: "Resolved",
        Timeout: "Timeout",
        NotFound: "NotFound"
    };

    //Log details to analytics
    sqlTraceLogger.log = async function (resultMsg, sessionStartTimeStamp) {

        var messageTypeString = messageTypes.getMessageTypeString(resultMsg.messageType);
        var status = "";
        if(resultMsg.status || resultMsg.downloadLink){
            status = sqlTraceLogger.traceStatus.Resolved;
        } else if (resultMsg.timeout){
            status = sqlTraceLogger.traceStatus.Timeout;
        } else{
            status = sqlTraceLogger.traceStatus.NotFound;
        }

        var sqlQuery = "INSERT INTO [dbo].[TraceLogs] ([TicketNumber],[UserId],[Category],[Channel],[Status],[RequestStartTime],[RequestEndTime])";
        sqlQuery += "VALUES(";
        sqlQuery += "'" + resultMsg.serviceNowTicketNumber + "',";
        sqlQuery += "'" + resultMsg.userId + "',";
        sqlQuery += "'" + messageTypeString + "',";
        sqlQuery += "'" + resultMsg.channel + "',";
        sqlQuery += "'" + status + "',";
        sqlQuery += "'" + sessionStartTimeStamp + "',";
        sqlQuery += "'" + new Date().toISOString() + "')";

        try {
            console.log(sqlQuery);
            sql.close();
            const conn = await sql.connect(process.env.SqlAnalyticsConnectionString);
            await new sql.Request().query(sqlQuery);
        } catch (err) {
            logger.logerror(err);
        }
    };

})(module.exports);
