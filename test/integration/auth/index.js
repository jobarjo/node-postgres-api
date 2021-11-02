/* eslint-disable import/no-extraneous-dependencies */
const { assert } = require('chai');
const request = require('superagent');
const R = require('ramda');
const Db = require('../../../database/index');
const appConfig = require('../../../config/config');
const utils = require('../../utils');

const dbMain = Db(appConfig.get('db_main'));
const { host, port } = appConfig.get('server');

const baseUrl = `http://${host}:${port}`;

describe('Auth Component', () => {
  before(async () => {
    await utils.cleanDb();
  });

  after(async () => {
    await utils.cleanDb();
    dbMain.sequelize.close();
  });

  const validSignedUp = {
    id: 'john@test.com',
    firstName: 'john2',
    lastName: 'wayne2',
    password: '123456OwW!',
  };

  describe('signup', () => {
    it('should return an error if some unexpected input is provided.', (done) => {
      const input = {
        notSupportedInput: 'blabla',
      };

      request
        .post(`${baseUrl}/auth/signup`)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: insupported input: notSupportedInput',
            },
          });

          done();
        });
    });

    it('should return an error if some input are missing.', (done) => {
      const input = {
        id: 'john@test.com',
        firstName: 'john',
        lastName: 'wayne',
      };

      request
        .post(`${baseUrl}/auth/signup`)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: Required data password missing.',
            },
          });

          done();
        });
    });

    it('should return an error if the format of the input is not correct.', (done) => {
      const input = {
        id: 'not_an_email',
        firstName: 'john',
        lastName: 'wayne',
        password: '123456OwW!',
      };

      request
        .post(`${baseUrl}/auth/signup`)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: insupported input format for: id',
            },
          });

          done();
        });
    });

    it('should register a user if the email is not already taken.', (done) => {
      request
        .post(`${baseUrl}/auth/signup`)
        .send(validSignedUp)
        .end((err, res) => {
          assert.equal(res.body, 'User successfully registered!');

          done(err);
        });
    });

    it('should return an error if the email is already registered.', (done) => {
      request
        .post(`${baseUrl}/auth/signup`)
        .send(validSignedUp)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Email is already taken.',
            },
          });

          done();
        });
    });
  });

  describe('signin', () => {
    it('should return an error if some unexpected input is provided.', (done) => {
      const input = {
        notSupportedInput: 'blabla',
      };

      request
        .post(`${baseUrl}/auth/signin`)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: insupported input: notSupportedInput',
            },
          });

          done();
        });
    });

    it('should return an error if some input are missing.', (done) => {
      const input = {
        password: 'qwerqweqwe123!',
      };

      request
        .post(`${baseUrl}/auth/signin`)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: Required data id missing.',
            },
          });

          done();
        });
    });

    it('should return an error if the user is not signed up.', (done) => {
      const input = {
        id: 'john2@test.com',
        password: '123456OwW!',
      };

      request
        .post(`${baseUrl}/auth/signin`)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Not Found');
          assert.equal(err.status, 404);

          assert.deepEqual(res.body, {
            error: {
              code: 'NotFound',
              message: 'User Not found',
            },
          });

          done();
        });
    });

    it('should signin a user if the input is correct.', async () => {
      const signupInput = {
        id: 'john2@test.com',
        firstName: 'john2',
        lastName: 'wayne2',
        password: '123456OwW!',
      };

      const signinInput = {
        id: 'john2@test.com',
        password: '123456OwW!',
      };

      await request
        .post(`${baseUrl}/auth/signup`)
        .send(signupInput);

      const res = await request
        .post(`${baseUrl}/auth/signin`)
        .send(signinInput);

      assert.deepEqual(R.keys(res.body), ['id', 'accessToken']);
    });
  });
});
