const fs = require('fs');
const tokenFile = "./email/apptokens.json";

const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};

const oauth2 = require('simple-oauth2').create(credentials);
const jwt = require('jsonwebtoken');

function getAuthUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
}

async function getAccessTokenFromCode(auth_code) {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });

  const token = oauth2.accessToken.create(result);
  console.log('Token created: ', token.token);

  saveToken(token);

  return token.token.access_token;
}

async function getAccessToken() {

  var appTokens = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
  var token = appTokens.token;
  var user = jwt.decode(token.id_token);

  // Check if token is expired ? 
  if(token.access_token){
    const FIVE_MINUTES = 300000;  // Expire 5 minutes early to account for clock differences
    var tokenExpirationTime = new Date(token.expires_at).getTime();
    const expiration = new Date(parseFloat(tokenExpirationTime - FIVE_MINUTES));
    if (expiration > new Date()) {
      console.log("Token not Expired.")
      return { 
        "accesstoken": token.access_token,
        "username" : user.name
      };
    }
  }

  // Get new token from refresh_token
  const refresh_token = token.refresh_token;
  if (refresh_token) {
    console.log("Token Expired. Getting new token using Refresh token.");
    //console.log(refresh_token);
    const newToken = await oauth2.accessToken.create({ refresh_token: refresh_token }).refresh();
    saveToken(newToken);
    return { 
      "accesstoken": newToken.token.access_token,
      "username" : user.name
    };
  }
}

function saveToken(token){
  fs.writeFile(tokenFile, JSON.stringify(token), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("Tokens Saved");
  });
}

exports.getAuthUrl = getAuthUrl;
exports.getAccessTokenFromCode = getAccessTokenFromCode;
exports.getAccessToken = getAccessToken;
exports.tokenFile = tokenFile;