import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { AppEnvironment, ConfigKey } from '../../config/app-config/app-config';
import * as process from 'node:process';

const processLogEntry = winston.format((info) => {
  if (
    info?.stack?.length &&
    !info?.error?.stack?.length &&
    info?.error?.hasOwnProperty('stack')
  ) {
    info.error.stack = info['stack'];
  }
  delete info['stack'];

  if (!info.hasOwnProperty('@timestamp')) {
    info['@timestamp'] = new Date().toISOString();
  }
  if (!info.hasOwnProperty('application')) {
    info['application'] = 'nestjs-app';
  }

  return info;
});
const removeRouterLog = winston.format((info) => {
  if (
    ['RoutesResolver', 'RouterExplorer', 'NestApplication'].includes(
      info.context,
    )
  ) {
    return false;
  }
  return info;
});

const transports: any = [
  new winston.transports.DailyRotateFile({
    // %DATE will be replaced by the current date
    filename: `logs/logs-%DATE%.log`,
    format: winston.format.combine(
      removeRouterLog(),
      processLogEntry(),
      winston.format.json(),
    ),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false, // don't want to zip our logs
    maxFiles: '30d', // will keep log until they are older than 30 days
  }),
];

if (process.env[ConfigKey.APP_ENV] !== AppEnvironment.PROD) {
  transports.push(
    new winston.transports.Console({
      level: 'silly', // silly or lesser then silly
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
        winston.format.timestamp(),
        removeRouterLog(),
        winston.format.printf((info) => {
          return `${info.timestamp} ${
            info.level
          }: ${info.message} ${info?.stack || ''}`;
        }),
      ),
    }),
  );
}

const winstonLogger = winston.createLogger({
  exitOnError: true,
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
  handleExceptions: true,
  handleRejections: true,
  transports: [...transports],
});

export default winstonLogger;
