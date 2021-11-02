const jwt = require('jsonwebtoken');

module.exports = (appConfig) => (req, res, next) => {
  const { user } = req.locals;

  const token = jwt.sign(
    {
      id: user.id,
    },
    appConfig.get('jwt').secret,
    {
      expiresIn: 86400, // 24 hours
    },
  );

  res.json({
    id: user.id,
    accessToken: token,
  });

  return next();
};
