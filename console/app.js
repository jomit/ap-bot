require("dotenv").load();
var messagebusjob = require("./messagebusjob");
var fs = require("fs");

console.log("Starting Bot Processing Job...");
messagebusjob.startprocessing();