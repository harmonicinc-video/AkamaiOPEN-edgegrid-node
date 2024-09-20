const log4js = require('log4js'),
    logger = log4js.getLogger();

if (!process.env.LOG4JS_CONFIG) {
  logger.level = log4js.levels.ERROR;
}

if (process.env.EDGEGRID_ENV === 'test') {
  logger.level = log4js.levels.OFF;
}

module.exports = logger;
