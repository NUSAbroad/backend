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
  winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
  winston.format.colorize({ all: true })
);

const transports = [new winston.transports.Console()];

const Logger = winston.createLogger({
  level,
  levels,
  format,
  transports,
  exitOnError: false
});

export default Logger;
