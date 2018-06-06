import winston, { Logger } from 'winston';
import config from '../config';

const logger = new Logger({
  transports: [
    new winston.transports.Console({
      level: config.ENVIRONMENT === 'production' ? 'error' : 'debug',
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
});

if (config.ENVIRONMENT !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
