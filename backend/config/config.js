const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "solidarite",
    dialect: "mysql",
  },
};

module.exports = config;
