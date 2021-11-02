/* eslint-disable import/no-extraneous-dependencies */
const { assert } = require('chai');
const R = require('ramda');
const request = require('superagent');
const Db = require('../../../database/index');
const appConfig = require('../../../config/config');
const { USERS } = require('../../../api/resources/variables/variables.json');
const utils = require('../../utils');

const dbMain = Db(appConfig.get('db_main'));
const { host, port } = appConfig.get('server');

const baseUrl = `http://${host}:${port}`;

describe('Users-Timestamp Component', () => {
  let users;
  const userCount = 3;

  before(async () => {
    await utils.cleanDb();

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

  describe('Get Timestamps', () => {
    let timestamps;

    before(async () => {
      timestamps = R.range(0, 3).map((i) => ({
        userId: users[1].id,
        name: `my timestamp${i}`,
        city: `my city${i}`,
        gmtDiff: i,
      }));

      await dbMain.Timestamp.bulkCreate(timestamps);
    });

    it('should return an error if user tries to fetch timestamps from another user than himsef without being an admin.', (done) => {
      request
        .get(`${baseUrl}/users/${users[2].id}/timestamps`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Forbidden');
          assert.equal(err.status, 403);

          assert.deepEqual(res.body, {
            error: {
              code: 'Forbidden',
              message: 'user is not allowed to perform this operation.',
            },
          });

          done();
        });
    });

    it('should allow and admin to fetch the timestamps from another user.', (done) => {
      request
        .get(`${baseUrl}/users/${users[1].id}/timestamps`)
        .set('x-access-token', users[0].accessToken)
        .end((err) => {
          assert.isNull(err);

          done();
        });
    });

    it('should return all the timestamps of the requester.', (done) => {
      request
        .get(`${baseUrl}/users/${users[1].id}/timestamps`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(res.body.length, timestamps.length);

          done();
        });
    });
  });

  describe('Create timestamp', () => {
    it('should return an error if user tries to crete a timestamp for another user than himsef without being an admin.', (done) => {
      const input = {
        name: 'my timestamp',
        city: 'my city',
        gmtDiff: 2,
      };

      request
        .post(`${baseUrl}/users/${users[2].id}/timestamps`)
        .set('x-access-token', users[1].accessToken)
        .send(input)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Forbidden');
          assert.equal(err.status, 403);

          assert.deepEqual(res.body, {
            error: {
              code: 'Forbidden',
              message: 'user is not allowed to perform this operation.',
            },
          });

          done();
        });
    });

    it('should allow an admin to create a timestamp for another user.', async () => {
      const input = {
        name: 'my timestamp',
        city: 'my city',
        gmtDiff: 2,
      };

      const res1 = await request
        .post(`${baseUrl}/users/${users[2].id}/timestamps`)
        .set('x-access-token', users[0].accessToken)
        .send(input);

      const res2 = await request
        .get(`${baseUrl}/timestamps/${res1.body.id}`)
        .set('x-access-token', users[0].accessToken);

      assert.equal(res2.body.id, res1.body.id);
    });

    it('should allow an user to create a timestamp for himself.', async () => {
      const input = {
        name: 'my timestamp',
        city: 'my city',
        gmtDiff: 2,
      };

      const res1 = await request
        .post(`${baseUrl}/users/${users[1].id}/timestamps`)
        .set('x-access-token', users[1].accessToken)
        .send(input);

      const res2 = await request
        .get(`${baseUrl}/timestamps/${res1.body.id}`)
        .set('x-access-token', users[1].accessToken);

      assert.equal(res2.body.id, res1.body.id);
    });
  });
});
