const requestIp = require('request-ip');
const R = require('ramda');
const LoggerFactory = require('../../../../utils/logger');

module.exports = (appConfig) => (req, res, next) => {
  const logger = LoggerFactory.create({
    enabled: appConfig.get('logging').enabled,
  });

  const regex = /^::ffff:/;

  const clientIP = regex.test(requestIp.getClientIp(req))
    ? requestIp.getClientIp(req).split(':').pop()
    : requestIp.getClientIp(req);

  logger.info({
    reqMethod: req.method,
    reqOriginalURL: req.originalUrl,
    reqDomainName: req.get('host'),
    clientIP,
    body: req.body,
    params: req.params,
    queryParams: req.query,
  });

  if (R.isNil(req.locals)) {
    req.locals = { logger };
  } else {
    req.locals.logger = logger;
  }

  return next();
};
