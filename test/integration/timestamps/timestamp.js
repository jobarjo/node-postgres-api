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

describe('Timestamps-Timestamp Component', () => {
  let users;
  let timestamps;
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

    // creating some timestamps
    const timestampsInfo = R.range(0, 3).map((i) => ({
      userId: users[i].id,
      name: `my timestamp${i}`,
      city: `my city${i}`,
      gmtDiff: i,
    }));

    timestamps = await dbMain.Timestamp.bulkCreate(timestampsInfo);
  });

  after(async () => {
    await utils.cleanDb();
    dbMain.sequelize.close();
  });

  describe('Get Timestamp', () => {
    it('should return an error if a non-admin tries to fetch a timestamp from another user.', (done) => {
      request
        .get(`${baseUrl}/timestamps/${timestamps[2].id}`)
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

    it('should return an error if the requeted timestamp does not exist.', (done) => {
      const fakeTimestampId = 'd44ba4a8-d519-48da-9f29-111111111111';

      request
        .get(`${baseUrl}/timestamps/${fakeTimestampId}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Not Found');
          assert.equal(err.status, 404);

          assert.deepEqual(res.body, {
            error: {
              code: 'NotFound',
              message: `Requested timestamp: ${fakeTimestampId} could not be found.`,
            },
          });

          done();
        });
    });

    it('should allow a user to fetch his timestamp.', (done) => {
      request
        .get(`${baseUrl}/timestamps/${timestamps[1].id}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(res.body.id, timestamps[1].id);

          done(err);
        });
    });

    it('should allow an admin to fetch the timestamp of another user.', (done) => {
      request
        .get(`${baseUrl}/timestamps/${timestamps[1].id}`)
        .set('x-access-token', users[0].accessToken)
        .end((err, res) => {
          assert.equal(res.body.id, timestamps[1].id);

          done(err);
        });
    });
  });

  describe('Patch timestamp', () => {
    it('should return an error if user tries to patch the timestamp of another user without being an admin.', (done) => {
      const patchInfo = {
        city: 'anotherCity',
      };

      request
        .patch(`${baseUrl}/timestamps/${timestamps[2].id}`)
        .send(patchInfo)
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

    it('should return an error if a non-admin tries to patch the timestamp userId.', (done) => {
      const patchInfo = {
        userId: users[2].id,
      };

      request
        .patch(`${baseUrl}/timestamps/${timestamps[1].id}`)
        .send(patchInfo)
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

    it('should allow a user to patch his timestamp.', async () => {
      const patchInfo = {
        city: 'anotherCity',
      };

      const res1 = await request
        .patch(`${baseUrl}/timestamps/${timestamps[2].id}`)
        .set('x-access-token', users[2].accessToken)
        .send(patchInfo);

      assert.equal(res1.body, 'Timestamp updated.');

      const res2 = await request
        .get(`${baseUrl}/timestamps/${timestamps[2].id}`)
        .set('x-access-token', users[2].accessToken)
        .send(patchInfo);

      assert.equal(res2.body.city, patchInfo.city);
    });

    it('should allow an admin to patch the timestamp of another user.', async () => {
      const patchInfo = {
        city: 'yetAnotherCity',
      };

      const res1 = await request
        .patch(`${baseUrl}/timestamps/${timestamps[2].id}`)
        .set('x-access-token', users[0].accessToken)
        .send(patchInfo);

      assert.equal(res1.body, 'Timestamp updated.');

      const res2 = await request
        .get(`${baseUrl}/timestamps/${timestamps[2].id}`)
        .set('x-access-token', users[2].accessToken)
        .send(patchInfo);

      assert.equal(res2.body.city, patchInfo.city);
    });
  });

  describe('Delete timestamp', () => {
    it('should return an error if the user tries to delete a timestamp from another user without being an admin.', (done) => {
      request
        .delete(`${baseUrl}/timestamps/${timestamps[2].id}`)
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

    it('should allow a user to delete his timestamp.', async () => {
      const res = await request
        .delete(`${baseUrl}/timestamps/${timestamps[2].id}`)
        .set('x-access-token', users[2].accessToken);

      assert.equal(res.body, 'Timestamp deleted.');

      try {
        await request
          .get(`${baseUrl}/timestamps/${timestamps[2].id}`)
          .set('x-access-token', users[2].accessToken);
      } catch (err) {
        assert.equal(err.name, 'Error');
        assert.equal(err.message, 'Not Found');
        assert.equal(err.status, 404);
      }
    });

    it('should allow an admin to delete another user timestamp.', async () => {
      const res = await request
        .delete(`${baseUrl}/timestamps/${timestamps[1].id}`)
        .set('x-access-token', users[0].accessToken);

      assert.equal(res.body, 'Timestamp deleted.');

      try {
        await request
          .get(`${baseUrl}/timestamps/${timestamps[1].id}`)
          .set('x-access-token', users[1].accessToken);
      } catch (err) {
        assert.equal(err.name, 'Error');
        assert.equal(err.message, 'Not Found');
        assert.equal(err.status, 404);
      }
    });
  });
});
