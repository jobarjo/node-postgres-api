/* eslint-disable no-underscore-dangle */
const { assert } = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const index = rewire('../../api');
const request = require('supertest');
const config = require('../../config/config');

describe('index.js', () => {
  describe('main', () => {
    it('should pass config and logger to the database', () => {
      const Db = index.__get__('Db');
      const spy = sinon.spy(Db);

      index.__set__('Db', spy);

      index(config);

      const { args } = spy.getCall(0);

      assert.deepEqual(args[0], config.get('db_main'));

      const loggerServiceName = args[1].defaultMeta.service;
      assert.deepEqual(loggerServiceName, 'local-server');

      index.__set__('Db', Db);
    });

    it('should send a 404 when route not found', (done) => {
      request(index(config))
        .get('/unknown/route')
        .expect(404)
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: {
              code: 'NotFound',
              message: 'Page Not Found.',
            },
          });

          done();
        });
    });
  });
});
