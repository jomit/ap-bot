(function (messagebus) {

    var azure = require('azure-sb');
    var logger = require("./logger");
    var connStr = process.env.ServiceBusConnectionString;
    var requestsQueue = process.env.ServiceBusQueueName;
    var serviceBus = azure.createServiceBusService(connStr);
    var responseInterval = 5000; //ms

    messagebus.sendMessage = function (msg, callback) {
        serviceBus.getQueue(requestsQueue, function (err, res) {
            if (err) {
                logger.logerror(err);
            } else {
                var responseQueueName = msg.replyTo;
                serviceBus.createQueueIfNotExists(responseQueueName, function (err) {
                    if (err) {
                        logger.logerror(err);
                        callback(err);
                    } else {
                        serviceBus.sendQueueMessage(requestsQueue, JSON.stringify(msg), function (err) {
                            if (!err) {
                                logger.log('Message Sent : ' + JSON.stringify(msg));
                                setTimeout(messagebus.checkForMessages.bind(null, serviceBus, responseQueueName, msg.epoch,2,
                                    messagebus.processMessage.bind(null, serviceBus, callback)), responseInterval);
                            } else {
                                logger.logerror(err);
                            }
                        });
                    }
                });
            }
        });
    };

    messagebus.checkForMessages = function (serviceBus, responseQueueName, originalEpoch, counter, callback) {
        serviceBus.receiveQueueMessage(responseQueueName, { isPeekLock: true }, function (err, lockedMessage) {
            if (err) {
                if(counter <= 3) {
                    logger.log("Counter = " + counter + " | Retrying for (" +  originalEpoch +")....");
                    var interval = responseInterval + (counter * 1500);  // exponential backoff
                    setTimeout(messagebus.checkForMessages.bind(null, serviceBus, responseQueueName, originalEpoch, ++counter,
                        messagebus.processMessage.bind(null, serviceBus, callback)), interval);
                } else{
                    callback({timeout:true}, null);
                }
            } else {
                var result = JSON.parse(lockedMessage.body);
                if (result.epoch == originalEpoch) {
                    callback(null, lockedMessage);
                } else{
                    logger.log("Epoch mismatch => " + lockedMessage.body);
                }
            }
        });
    };

    messagebus.processMessage = function (serviceBus, callback, err, lockedMsg) {
        if (err) {
            logger.logerror(err);
            callback(err);
        } else {
            var result = JSON.parse(lockedMsg.body);
            logger.log('Message reply => ' + JSON.stringify(result));
            serviceBus.deleteMessage(lockedMsg, function (deleteError) {
                if (deleteError) {
                    logger.logerror(deleteError);
                }
                callback(result);
            });
        }
    };

})(module.exports);