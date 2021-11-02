const R = require('ramda');
const { createLogger, format, transports } = require('winston');

const defaults = R.flip(R.merge);

const defaultOptions = {
  enabled: false,
  level: 'debug',
  defaultMeta: {},
};

module.exports = {
  /**
     * Create a Winston logger object.
     * Example options:
     * {
     *  enabled: false,
     *  level: 'debug',
     *  defaultMeta: {}
     * }
     */
  create: (_options) => {
    // Use defaultOptions, is options are missing.
    const options = defaults(_options, defaultOptions);

    // For local builds, use colorized simple format,
    // otherwise uses the existing format.
    const loggingFormat = process.env.NODE_ENV !== 'production'
      ? format.combine(format.colorize(), format.simple())
      : null;

    // Print to console, unless logging is disabled
    const loggingTransports = [
      new transports.Console({
        format: loggingFormat,
        silent: options.enabled === false,
      }),
    ];

    return createLogger({
      level: options.level,
      format: format.combine(
        format.timestamp(),
        format.errors(),
        format.splat(),
        format.json(),
      ),
      defaultMeta: options.defaultMeta,
      transports: loggingTransports,
    });
  },
};
