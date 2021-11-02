/* eslint-disable import/no-extraneous-dependencies */
const { assert } = require('chai');
const request = require('superagent');
const appConfig = require('../../config/config');

const { host, port } = appConfig.get('server');

describe('Healthcheck', () => {
  it('returns the healthcheck', (done) => {
    request
      .get(`http://${host}:${port}`)
      .end((err, res) => {
        assert.deepEqual(res.body, {
          serverConfig: {
            host: 'localhost',
            port: '8080',
            name: 'local-server',
          },
          version: '1.0.0',
        });

        done(err);
      });
  });
});
