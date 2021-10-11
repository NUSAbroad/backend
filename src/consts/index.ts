import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL: string = process.env.DATABASE_URL || '';

const NUS_MODS_MODULES_INFO_URL = 'https://api.nusmods.com/v2/';

export { PORT, DATABASE_URL, NUS_MODS_MODULES_INFO_URL };
