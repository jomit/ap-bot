require("dotenv").load();
const restify = require('restify');
const builder = require('botbuilder');
const botbuilder_azure = require("botbuilder-azure");
const dialogs = require("./dialogs");

var server = restify.createServer();
server.listen(process.env.port || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

server.post('/api/messages', connector.listen());

//Storage samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
//var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
//var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);
var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' to see what I can do.', session.message.text);
});
bot.set('storage', inMemoryStorage);

var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

dialogs.init(bot);