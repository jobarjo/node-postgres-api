const restifyErrors = require('restify-errors');

module.exports = (req, res, next) => next(new restifyErrors.NotFoundError('Page Not Found.'));
