# Accounts Payable Bot using Azure Bot Service

![Accounts Payable Bot using Azure Bot Service](https://raw.githubusercontent.com/jomit/ap-bot/master/images/architecture.png)

#### Prerequisites
 
- Active [Azure Subscription](https://azure.microsoft.com/en-us/free)

- Install [Visual Studio Code](https://code.visualstudio.com/)

- Install [nodejs 8.11](https://nodejs.org/en/)

- Install [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)

#### Bot Service

*Note: Creating the web app bot in Azure also creates an AAD App. If you do not have access to create apps in AAD you can ask your administrator to create a Converged Application at [apps.dev.microsoft.com](https://apps.dev.microsoft.com/) and add you as Owner. Once you are added as owner, you can generate a new password and use it while creating the web app bot*

- Create a [Web App Bot](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart?view=azure-bot-service-3.0)
    - Under Bot template select Language Understanding NodeJS.
- Click on `Application Settings` and copy values for `MicrosoftAppId`,`MicrosoftAppPassword`,`LuisAppId` and`LuisAPIKey`

#### LUIS

*Note: If you have created the Web App Bot the LUIS app will be created for you automatically.*

- Log in to [www.luis.ai](http://www.luis.ai/) and under `My Apps` click the app that was created.
- Copy name of the LUIS App and update it in the `luis-model\contosoapbot.json` file.
- Under `Settings` tab, click on `Import new version` and upload the `luis-model\contosoapbot.json` file.
- Click on `Train Button` to train the updated model.
- Under `Publish` tab, click on `Publish` button to publish the model to both Production and Staging. 

![Import LUIS Model](https://raw.githubusercontent.com/jomit/ap-bot/master/images/import-luis-model.png)

#### Deploy & Test Locally

- TODO

#### Deploy on Azure

- *TODO*

- Update Nodejs version to 8.11.1
- Update Application Settings
- Deploy code

