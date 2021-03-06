import * as dotenv from 'dotenv';
import slug from 'slug';

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL: string = process.env.DATABASE_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';
const SECRET_KEY = process.env.SECRET_KEY || '';
const ON_AUTH = process.env.ON_AUTH === 'true' || false;
const REDIS_URL = process.env.REDIS_URL || '';

const NUS_MODS_MODULES_INFO_URL = 'https://api.nusmods.com/v2/';
const NUS = 'National University of Singapore';
const NUSSLUG = slug(NUS);
const LINE_BREAK_REGEX = '/(\r\n|\n|\r)/gm';

export {
  PORT,
  DATABASE_URL,
  NUS_MODS_MODULES_INFO_URL,
  NUSSLUG,
  NODE_ENV,
  SECRET_KEY,
  ON_AUTH,
  REDIS_URL,
  LINE_BREAK_REGEX
};
