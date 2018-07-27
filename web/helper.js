(function (helper) {
    var idleTimeout;
    helper.getUserIdAndChannel = function (userString) {
        var start = userString.indexOf("sip:")
        if (start == -1) {
            return {
                userId: userString,
                channel: "web"
            };
        }
        return {
            userId: userString.substr(start + 4, userString.length - 1),
            channel: "skype-for-business"
        };
    };

    helper.getUserResponseQueueName = function (userId) {
        return userId.replace("@", "-");
    };

    helper.saveInSession = function (session, key, value) {
        session.userData[key] = value;
    };

    helper.getFromSession = function (session, key) {
        return session.userData[key];
    };

    helper.getServiceNowTicketNumber = function (session) {
        return helper.getFromSession(session, "serviceNowTicketNumber")
    };

    helper.generateDefaultMessage = function (session) {
        var result = helper.getUserIdAndChannel(session.message.user.id);
        return {
            userId: result.userId,
            epoch: Date.now(),
            replyTo: helper.getUserResponseQueueName(result.userId),
            channel: result.channel,
            serviceNowTicketNumber: helper.getServiceNowTicketNumber(session)
        }
    };

    helper.startIdleTimeout = function(session){
        idleTimeout = setTimeout(() => {
            session.beginDialog("HumanHandoffDialog");
        },30000);
    };

    helper.stopIdleTimeout = function(callback){
        if(idleTimeout){
            clearTimeout(idleTimeout);
        }
    };

})(module.exports);