import * as dotenv from 'dotenv';
import winston from 'winston';
import { NODE_ENV } from '../consts';

dotenv.config();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const level = NODE_ENV === 'development' ? 'debug' : 'http';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

let transports;

if (NODE_ENV === 'development') {
  transports = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/all.log' })
  ];
} else {
  transports = [new winston.transports.Console()];
}

const Logger = winston.createLogger({
  level,
  levels,
  format,
  transports,
  exitOnError: false
});

export default Logger;