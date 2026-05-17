import "dotenv/config";
import Sequelize from "sequelize";

const tempConnection = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  timezone: process.env.DB_TIMEZONE,
});
await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
await tempConnection.close();

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  timezone: process.env.DB_TIMEZONE,
  database: process.env.DB_NAME,
});

export default connection;
