# Environment variables

## Loading

Environement variables are loaded inside of the app via the `config/config.js` file with the use of the `nconf` lib.

nconf setup will use in-order:
  1. Command-line arguments
  2. Environment variables (Ex: DB__USERNAME=apps)
  3. File 'config/default.json'

Furthermore, if the app is launched outside of a production environment, defined as `NODE_ENV=production`, then it will load env located inside of `env/.env` thanks to the `dotenv` lib.

### Additional env input

- Local docker-compose setup will use both the env defined inside of the docker-compose yml file, and the ones defined inside of `env/.env`.
- env variables referenced inside of the `command` line inside of the compose file requires escaping with `$` in order to not be read during file parsing (see doc [here](https://docs.docker.com/compose/compose-file/compose-file-v3/#variable-substitution) and explication [here](https://stackoverflow.com/questions/40447029/docker-compose-environment-variable-for-command))

## Access

Environment variables can then be used by requiring the `config/config.js` file as such:

```javascript
const appConfig = require('/config/config.js');

const an_env_example = appConfig.get("AN_EXAMPLE");
```

More details on how to nconf on the npm page.