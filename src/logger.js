import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';
const options = {};

if (isDevelopment) {
  options.level = 'debug';
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

// In test environment, disable logging
if (process.env.EDGEGRID_ENV === 'test') {
  options.level = 'silent';
}

const logger = pino(options);

export default logger;
