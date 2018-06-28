import winston, { Logger } from 'winston';
import config from '../config';

const tsFormat = () => new Date().toISOString();

const logger = new Logger({
  transports: [
    new winston.transports.Console({
      level: config.ENVIRONMENT === 'production' ? 'error' : 'debug',
      timestamp: tsFormat,
      colorize: true,
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
});

if (config.ENVIRONMENT !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
