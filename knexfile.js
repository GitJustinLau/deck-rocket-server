require('dotenv').config();

const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME
} = process.env;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  client: "mysql2",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    charset: "utf8",
  }

};
