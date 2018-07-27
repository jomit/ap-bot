# Accounts Payable Bot using Azure Bot Service

![Accounts Payable Bot using Azure Bot Service](https://raw.githubusercontent.com/jomit/ap-bot/master/images/architecture.png)

### Prerequisites
 
- Active [Azure Subscription](https://azure.microsoft.com/en-us/free)

- Install [Visual Studio Code](https://code.visualstudio.com/)

- Install [nodejs 8.11](https://nodejs.org/en/)

- Install [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Bot Service

*Note: Creating the web app bot in Azure also creates an AAD App. If you do not have access to create apps in AAD you can ask your administrator to create a Converged Application at [apps.dev.microsoft.com](https://apps.dev.microsoft.com/) and add you as Owner. Once you are added as owner, you can generate a new password and use it while creating the web app bot*

- Create a [Web App Bot](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart?view=azure-bot-service-3.0)
    - Under Bot template select Language Understanding NodeJS.
- Click on `Application Settings` and copy values for `MicrosoftAppId`,`MicrosoftAppPassword`,`LuisAppId` and`LuisAPIKey` and update it in the `web\sample.env` file.

### LUIS

*Note:   If you have created the Web App Bot the LUIS app will be created for you automatically.*

- Log in to [www.luis.ai](http://www.luis.ai/) and under `My Apps` click the app that was created.
- Copy name of the LUIS App and update it in the `luis-model\contosoapbot.json` file.
- Under `Settings` tab, click on `Import new version` and upload the `luis-model\contosoapbot.json` file.
- Click on `Train Button` to train the updated model.
- Under `Publish` tab, click on `Publish` button to publish the model to both Production and Staging. 

![Import LUIS Model](https://raw.githubusercontent.com/jomit/ap-bot/master/images/import-luis-model.png)

### Service Bus

- Create a new [Service Bus namespace in Azure](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-portal)
- Under the namespace create a new queue named `requests`
- Under `Shared access policies`, click on `RootManageSharedAccessKey` and copy value for `Primary Connection String`.
- Update the `ServiceBusConnectionString` in `web\sample.env` and `console\sample.env` files.

### Databases

- **Analytics DB**
    - Create a new Azure SQL DB (or a local SQL Server DB).
    - Create table in the DB using `web\analytics\dbscript.sql`.
    - Update the `SqlAnalyticsConnectionString` in `web\sample.env` file.

- **Invoice DB**
    - Create a new DB on your local SQL Server named `ContosoEdw`.
    - Run `console\dbscript\localdb.sql`.
    - Update the `sqledwConnectionString` in `console\sample.env` file.

### Servicenow

- Create a servicenow developer account and [create a new dev instance](https://developer.servicenow.com/app.do#!/instance).
- Login to the dev instance and update the admin password.
- Copy dev instance `url`, `password` and update `ServiceNowUrl`, `ServiceNowPassword` in `web\sample.env` file.

- *Note: While testing you can click on `Incidents` to see the new tickets created by the Bot*

### Test Locally

- Rename `web\sample.env`, `console\sample.env` to `.env`

- **Start Bot Web App**
    - `cd web`
    - `npm install`
    - `npm start`

- **Start Bot Process Job**
    - `cd console`
    - `npm install`
    - `npm start`

- **Start Bot Emulator**
    - `Endpoint Url : http://localhost:3978/api/messages`
    - `Microsoft App ID: [Use MicrosoftAppId from .env file]`
    - `Microsoft App Password: [Use MicrosoftAppPassword from .env file]`
    - Click Connect

- Type `Hi` in the bot emulator, it should return the text from the Greeting Dialog

    ![Bot Emulator - Hi](https://raw.githubusercontent.com/jomit/ap-bot/master/images/bot-emulator.png)

- Test bot processor job integration using below sentences, you can always type `help` to get more details:

    - **Payment Status** - `what is the payment status for invoice number 11001 and vendor Contoso Inc`
    - **PO Status** - `what is the status for po number 11001`
    - **Invoice Copy** - `could I have a copy of invoice 11001 from vendor Contoso Inc` 

    ![Invoice Dialogs](https://raw.githubusercontent.com/jomit/ap-bot/master/images/invoice-dialogs.png)

- To Test Servicenow, log in to the dev intance and click on `Incidents` to see the tickets created/updated by the Bot

### Deploy on Azure

- *TODO*

- Update Nodejs version to 8.11.1
- Update Application Settings
- Deploy code

