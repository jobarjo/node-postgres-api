const path = require('path');
const nconf = require('nconf');
const dotenv = require('dotenv');

// Setup local environment variables from env forlder
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../env/.env') });
}

const appConfig = new nconf.Provider();

appConfig
  .argv()
  .env({
    separator: '__',
    lowerCase: true,
  })
  .file({ file: path.join(__dirname, '/app-config.json') });

module.exports = appConfig;
