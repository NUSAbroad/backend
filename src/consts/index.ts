import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL: string = process.env.DATABASE_URL || "";

export { PORT, DATABASE_URL };
