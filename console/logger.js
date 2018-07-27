(function (logger) {
    logger.logerror = function (err) {
        console.log(err);
    };

    logger.log = function (message) {
        console.log(message);
    };

})(module.exports);