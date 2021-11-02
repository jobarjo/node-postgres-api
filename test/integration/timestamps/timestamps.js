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

describe('Timestamps-Timestamps Component', () => {
  let users;
  let timestamps;
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

    // creating some timestamps
    timestamps = R.range(0, 3).map((i) => ({
      userId: users[i].id,
      name: `my timestamp${i}`,
      city: `my city${i}`,
      gmtDiff: i,
    }));

    await dbMain.Timestamp.bulkCreate(timestamps);
  });

  after(async () => {
    await utils.cleanDb();
    dbMain.sequelize.close();
  });

  describe('Get timestamps', () => {
    it('should return an error if the requester is not an admin.', (done) => {
      request
        .get(`${baseUrl}/timestamps`)
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

    it('should allow and admin to fetch all the timestamps.', (done) => {
      request
        .get(`${baseUrl}/timestamps`)
        .set('x-access-token', users[0].accessToken)
        .end((err, res) => {
          assert.equal(res.body.length, timestamps.length);

          done();
        });
    });
  });

  describe('Create timestamps', () => {
    it('should return an error if the requester is not an admin.', (done) => {
      const input = {
        name: 'my timestamp',
        city: 'my city',
        gmtDiff: 2,
        userId: users[1].id,
      };

      request
        .post(`${baseUrl}/timestamps`)
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

    it('should allow and admin to create a timestamp.', async () => {
      const input = {
        name: 'my timestamp',
        city: 'my city',
        gmtDiff: 2,
        userId: users[1].id,
      };

      const res1 = await request
        .post(`${baseUrl}/timestamps`)
        .set('x-access-token', users[0].accessToken)
        .send(input);

      const res2 = await request
        .get(`${baseUrl}/timestamps/${res1.body.id}`)
        .set('x-access-token', users[1].accessToken);

      assert.equal(res2.body.id, res1.body.id);
    });
  });
});
