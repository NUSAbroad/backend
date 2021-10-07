import dotenv from "dotenv";

import { DATABASE_URL } from "../consts/index";
import { Sequelize } from "sequelize";

dotenv.config();

let sequelize: Sequelize;
const logging = process.env.NODE_ENV === "development" ? false : console.log;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  });
} else {
  sequelize = new Sequelize(DATABASE_URL, {
    logging,
  });
}

export default sequelize;
