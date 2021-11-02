const request = require('superagent');
const R = require('ramda');
const Db = require('../../database/index');
const appConfig = require('../../config/config');

const dbMain = Db(appConfig.get('db_main'));
const { host, port } = appConfig.get('server');

const baseUrl = `http://${host}:${port}`;

module.exports = {
  /**
   * Utility function to create users in the database
   */
  registerUsers: async (userCount) => {
    const usersInfo = R.range(0, userCount).map((i) => ({
      id: `email${i}@test.com`,
      password: '123456OwW!',
      firstName: `firstName${i}`,
      lastName: `firstName${i}`,
    }));

    const res = await Promise.all(
      usersInfo.map((userInfo, i) => apiCall(
        'post',
        'auth/signup',
        userInfo,
      ).then(() => apiCall(
        'post',
        'auth/signin',
        {
          id: usersInfo[i].id,
          password: usersInfo[i].password,
        },
      ))),
    );

    const users = usersInfo.map((userInfo, i) => ({
      ...userInfo,
      accessToken: res[i].body.accessToken,
    }));

    return users;
  },

  /**
   * Calls the cleanAll endpoint that delets all data on both firebase
   * and the backend DB
   */
  cleanDb: async () => {
    await dbMain.sequelize.sync({ force: true });
    // await dbMain.sequelize.close();
  },

  syncDb: async () => {
    await dbMain.sequelize.sync({ force: false });
    // await dbMain.sequelize.close();
  },
};

function apiCall(verb, endpoint, body) {
  return request[verb](`${baseUrl}/${endpoint}`)
    .send(body);
}
