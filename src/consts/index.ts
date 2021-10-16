import * as dotenv from 'dotenv';
import slug from 'slug';

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL: string = process.env.DATABASE_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

const NUS_MODS_MODULES_INFO_URL = 'https://api.nusmods.com/v2/';
const NUS = 'National University of Singapore';
const NUSSLUG = slug(NUS);

export { PORT, DATABASE_URL, NUS_MODS_MODULES_INFO_URL, NUSSLUG, NODE_ENV };
