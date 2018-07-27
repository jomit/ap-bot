(function (messagebusjob) {

    var azure = require('azure-sb');
    var logger = require("./logger");
    var async = require('async');
    var email = require("./email");
    var invoiceinquiryjob = require("./invoiceinquiryjob");
    var messageTypes = {
        paymentStatus: 1,
        poStatus: 2,
        invoiceCopy: 3,
        uploadInvoice: 4
    };
    var jobInterval = 100; //ms

    messagebusjob.startprocessing = function () {
        var connStr = process.env.ServiceBusConnectionString;
        var requestsQueue = process.env.ServiceBusQueueName;
        var serviceBus = azure.createServiceBusService(connStr);
        serviceBus.getQueue(requestsQueue, function (err, res) {
            if (err) {
                logger.logerror(err);
            } else {
                //console.log('current msg count ' + res.MessageCount);
                setInterval(messagebusjob.checkForMessages.bind(null, serviceBus, requestsQueue,
                    messagebusjob.processMessage.bind(null, serviceBus)), jobInterval);
            }
        });
    };

    messagebusjob.checkForMessages = function (serviceBus, requestsQueueName, callback) {
        serviceBus.receiveQueueMessage(requestsQueueName, { isPeekLock: true }, function (err, lockedMessage) {
            if (err) {
                if (err !== 'No messages to receive') {
                    callback(err);
                }
            } else {
                callback(null, lockedMessage);
            }
        });
    };

    messagebusjob.processMessage = function (serviceBus, err, queueMessage) {
        if (err) {
            logger.logerror(err);
        } else {
            var requestMessage = JSON.parse(queueMessage.body);
            if (requestMessage.messageType == messageTypes.paymentStatus) {
                invoiceinquiryjob.processPaymentStatus(requestMessage, function (resultMessage) {
                    messagebusjob.sendResult(serviceBus, resultMessage, requestMessage.replyTo, queueMessage);
                });
            }
            else if (requestMessage.messageType == messageTypes.poStatus) {
                invoiceinquiryjob.processPOStatus(requestMessage, function (resultMessage) {
                    messagebusjob.sendResult(serviceBus, resultMessage, requestMessage.replyTo, queueMessage);
                });
            }
            else if (requestMessage.messageType == messageTypes.invoiceCopy) {
                invoiceinquiryjob.processInvoiceCopy(requestMessage, function (resultMessage) {
                    messagebusjob.sendResult(serviceBus, resultMessage, requestMessage.replyTo, queueMessage);
                });
            }
            else {
                logger.logerror("Invalid message type !");
                return;
            }
        }
    };

    messagebusjob.sendResult = async function (serviceBus, resultMessage, replyTo, queueMessage) {
        if (resultMessage.channel == "email") {
            await email.replyMessage(resultMessage);
            messagebusjob.deletemessage(serviceBus, queueMessage);
        } else {
            messagebusjob.deleteAllExistingMessages(serviceBus, replyTo, function () {
                messagebusjob.sendMessage(serviceBus, resultMessage, replyTo, function () {
                    messagebusjob.deletemessage(serviceBus, queueMessage);
                });
            });
        }
    };

    messagebusjob.sendMessage = function (serviceBus, resultMessage, responseQueueName, callback) {
        serviceBus.createQueueIfNotExists(responseQueueName, function (err, res) {
            serviceBus.sendQueueMessage(responseQueueName, JSON.stringify(resultMessage), function (err) {
                if (err) {
                    logger.logerror(err);
                } else {
                    logger.log('Result Message Sent : ' + JSON.stringify(resultMessage));
                    callback();
                }
            });
        });
    };

    messagebusjob.deletemessage = function (serviceBus, queueMessage) {
        serviceBus.deleteMessage(queueMessage, function (deleteError) {
            if (deleteError) {
                logger.logerror(deleteError);
            } else {
                logger.log('Message Deleted : ' + JSON.stringify(queueMessage));
            }
        })
    };

    messagebusjob.deleteAllExistingMessages = function (serviceBus, queueName, callback) {
        // TODO: Need to add logic to only delete messages which are older than 60 minutes
        serviceBus.getQueue(queueName, function (err, res) {
            logger.log('Found ' + res.MessageCount + ' exisiting messages');
            if (res.MessageCount == 0) {
                callback();
            } else {
                async.times(res.MessageCount, function (item, next) {
                    serviceBus.receiveQueueMessage(queueName, function (error, receivedMessage) {
                        if (error) {
                            logger.logerror(err);
                        }
                        next(err);
                    });
                }, function (err) {
                    console.log('Deleted all existing messages.');
                    callback();
                });
            }
        });
    };

})(module.exports);