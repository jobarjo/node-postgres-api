/* eslint-disable import/no-extraneous-dependencies */
const { assert } = require('chai');
const R = require('ramda');
const request = require('superagent');
const Db = require('../../../database/index');
const appConfig = require('../../../config/config');
const { User } = require('../../../api/resources/entities');
const { USERS } = require('../../../api/resources/variables/variables.json');
const utils = require('../../utils');

const dbMain = Db(appConfig.get('db_main'));
const { host, port } = appConfig.get('server');

const baseUrl = `http://${host}:${port}`;

describe('Users-Users Component', () => {
  let users;
  const userCount = 3;

  before(async () => {
    // creating users
    users = await utils.registerUsers(userCount);

    // setting up first user as admin
    dbMain.User.update(
      {
        role: USERS.ROLES.ADMIN,
      },
      {
        where: {
          id: users[0].id,
        },
      },
    );
  });

  after(async () => {
    await utils.cleanDb();
    dbMain.sequelize.close();
  });

  describe('Access verification', () => {
    it('should return an error if the access token is not provided', (done) => {
      request
        .get(`${baseUrl}/users`)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Unauthorized');
          assert.equal(err.status, 401);

          assert.deepEqual(res.body, {
            error: {
              code: 'Unauthorized',
              message: 'No token provided.',
            },
          });

          done();
        });
    });

    it('should return an error if the token is valid but timedout', (done) => {
      const timedOutToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4yQHRlc3QuY29tIiwiaWF0IjoxNjM1Njc2MDg1LCJleHAiOjE2MzU3NjI0ODV9.jOQ_ut7Ks63xTRtKTsz6fbXXo_BmQCORIZFgBLbneoA';

      request
        .get(`${baseUrl}/users`)
        .set('x-access-token', timedOutToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Unauthorized');
          assert.equal(err.status, 401);

          assert.deepEqual(res.body, {
            error: {
              code: 'Unauthorized',
              message: 'Unauthorized.',
            },
          });

          done();
        });
    });
  });

  describe('Get Users', () => {
    it('should return all users with only public fields.', (done) => {
      request
        .get(`${baseUrl}/users`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(res.status, 200);

          assert.equal(res.body.length, userCount);

          res.body.forEach((user) => {
            R.keys(user).forEach((userProp) => {
              assert.isTrue(R.includes(userProp, User.publicFields));
            });
          });

          done(err);
        });
    });
  });
});
