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

describe('Users-User Component', () => {
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

  describe('Get User', () => {
    it('should return an error if the format of the user id is not correct.', (done) => {
      const fakeUser = 'not_an_email';

      request
        .get(`${baseUrl}/users/${fakeUser}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: insupported input format for: targetUserId',
            },
          });

          done();
        });
    });

    it('should return an error if the requeted user does not exist.', (done) => {
      const fakeUser = 'not_existing_user@test.com';

      request
        .get(`${baseUrl}/users/${fakeUser}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Not Found');
          assert.equal(err.status, 404);

          assert.deepEqual(res.body, {
            error: {
              code: 'NotFound',
              message: `Requested user: ${fakeUser} could not be found.`,
            },
          });

          done();
        });
    });

    it('should allow to get oneself with unfiltered data but no password.', (done) => {
      request
        .get(`${baseUrl}/users/${users[0].id}`)
        .set('x-access-token', users[0].accessToken)
        .end((err, res) => {
          assert.equal(res.body.id, users[0].id);
          assert.equal(res.body.firstName, users[0].firstName);
          assert.equal(res.body.lastName, users[0].lastName);

          assert.isTrue(R.includes('role', R.keys(res.body)));

          assert.isTrue(!R.includes('passwordHash', R.keys(res.body)));

          done(err);
        });
    });

    it('should allow to get another user as non-admin with public data only.', (done) => {
      request
        .get(`${baseUrl}/users/${users[2].id}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(res.body.id, users[2].id);

          R.keys(res.body).forEach((userProp) => {
            assert.isTrue(R.includes(userProp, User.publicFields));
          });

          done(err);
        });
    });

    it('should allow to get another user as admin with unfiltred data minus password.', (done) => {
      request
        .get(`${baseUrl}/users/${users[2].id}`)
        .set('x-access-token', users[0].accessToken)
        .end((err, res) => {
          assert.equal(res.body.id, users[2].id);

          assert.isTrue(R.includes('role', R.keys(res.body)));

          assert.isTrue(!R.includes('passwordHash', R.keys(res.body)));

          done(err);
        });
    });
  });

  describe('Patch User', () => {
    it('should return an error if the requeted user does not exist.', (done) => {
      const fakeUser = 'not_existing_user@test.com';

      request
        .patch(`${baseUrl}/users/${fakeUser}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Not Found');
          assert.equal(err.status, 404);

          assert.deepEqual(res.body, {
            error: {
              code: 'NotFound',
              message: `Requested user: ${fakeUser} could not be found.`,
            },
          });

          done();
        });
    });

    it('should return an error if the body contains unexpected input.', (done) => {
      const input = {
        unexpectedProp: 'blabla',
      };

      request
        .patch(`${baseUrl}/users/${users[1].id}`)
        .send(input)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: insupported input: unexpectedProp',
            },
          });

          done();
        });
    });

    it('should return an error if the body input is not of the expected format.', (done) => {
      const input = {
        firstName: 123123,
      };

      request
        .patch(`${baseUrl}/users/${users[1].id}`)
        .send(input)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: insupported input format for: firstName',
            },
          });

          done();
        });
    });

    it('should return an error if trying to set a null for a parameter not allowing it.', (done) => {
      const input = {
        password: null,
      };

      request
        .patch(`${baseUrl}/users/${users[1].id}`)
        .send(input)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Bad Request');
          assert.equal(err.status, 400);

          assert.deepEqual(res.body, {
            error: {
              code: 'BadRequest',
              message: 'Error: null not allow for: password',
            },
          });

          done();
        });
    });

    it('should return an error if user tries to patch another user than himsef without being an admin.', (done) => {
      const patchInfo = {
        firstName: 'newFirstName',
      };

      request
        .patch(`${baseUrl}/users/${users[2].id}`)
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

    it('Should return an error if trying to modify its role without being an admin.', (done) => {
      const patchInfo = {
        role: USERS.ROLES.BASIC,
      };

      request
        .patch(`${baseUrl}/users/${users[1].id}`)
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

    it('should be able to patch oneself.', async () => {
      const patchInfo = {
        firstName: 'newFirstName',
      };

      const res1 = await request
        .patch(`${baseUrl}/users/${users[1].id}`)
        .set('x-access-token', users[1].accessToken)
        .send(patchInfo);

      assert.equal(res1.body, 'User updated.');

      const res2 = await request
        .get(`${baseUrl}/users/${users[1].id}`)
        .set('x-access-token', users[1].accessToken)
        .send(patchInfo);

      assert.equal(res2.body.firstName, patchInfo.firstName);
    });

    it('should be able to patch another user, including its role, as admin.', async () => {
      const patchInfo = {
        firstName: 'newFirstName',
        role: USERS.ROLES.BASIC,
      };

      const res1 = await request
        .patch(`${baseUrl}/users/${users[2].id}`)
        .set('x-access-token', users[0].accessToken)
        .send(patchInfo);

      assert.equal(res1.body, 'User updated.');

      const res2 = await request
        .get(`${baseUrl}/users/${users[2].id}`)
        .set('x-access-token', users[2].accessToken)
        .send(patchInfo);

      assert.equal(res2.body.firstName, patchInfo.firstName);
    });
  });

  describe('Delete User', () => {
    it('should return an error if the requeted user does not exist.', (done) => {
      const fakeUser = 'not_existing_user@test.com';

      request
        .delete(`${baseUrl}/users/${fakeUser}`)
        .set('x-access-token', users[1].accessToken)
        .end((err, res) => {
          assert.equal(err.name, 'Error');
          assert.equal(err.message, 'Not Found');
          assert.equal(err.status, 404);

          assert.deepEqual(res.body, {
            error: {
              code: 'NotFound',
              message: `Requested user: ${fakeUser} could not be found.`,
            },
          });

          done();
        });
    });

    it('should return an error if the user tries to delete a user different than himself without being an admin.', (done) => {
      request
        .delete(`${baseUrl}/users/${users[2].id}`)
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

    it('should delete the user if it is requested by the same user.', async () => {
      const res = await request
        .delete(`${baseUrl}/users/${users[2].id}`)
        .set('x-access-token', users[2].accessToken);

      assert.equal(res.body, 'User deleted.');

      try {
        await request
          .get(`${baseUrl}/users/${users[2].id}`)
          .set('x-access-token', users[0].accessToken);
      } catch (err) {
        assert.equal(err.name, 'Error');
        assert.equal(err.message, 'Not Found');
        assert.equal(err.status, 404);
      }
    });

    it('should delete the user if it is requested by an admin.', async () => {
      const res = await request
        .delete(`${baseUrl}/users/${users[1].id}`)
        .set('x-access-token', users[0].accessToken);

      assert.equal(res.body, 'User deleted.');

      try {
        await request
          .get(`${baseUrl}/users/${users[1].id}`)
          .set('x-access-token', users[0].accessToken);
      } catch (err) {
        assert.equal(err.name, 'Error');
        assert.equal(err.message, 'Not Found');
        assert.equal(err.status, 404);
      }
    });
  });
});
