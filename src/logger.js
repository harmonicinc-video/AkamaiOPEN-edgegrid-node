import pino from 'pino';

const options = {
  // Default level can be overridden by LOG_LEVEL env var
  level: process.env.LOG_LEVEL || 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

// In test environment, disable logging
if (process.env.EDGEGRID_ENV === 'test') {
  options.level = 'silent';
}

const logger = pino(options);

export default logger;
