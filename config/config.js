require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DB_URL_EXTERNAL',
    dialect: 'postgres',
    dialectOptions: {
      ssl:
        process.env.DB_SSL === 'true'
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
    logging: false,
  },
};
