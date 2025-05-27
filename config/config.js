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
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl:
        process.env.DB_SSL === 'true'
          ? { require: true, rejectUnauthorized: false }
          : false,
      keepAlive: true,
    },
    logging: false,
  },
};

// module.exports = {
//   development: {
//     username: process.env.DEV_DB_USER,
//     password: process.env.DEV_DB_PASSWORD,
//     database: process.env.DEV_DB_NAME,
//     host: '127.0.0.1',
//     dialect: 'postgres',
//   },
//   test: {
//     username: process.env.DEV_DB_USER,
//     password: process.env.DEV_DB_PASSWORD,
//     database: process.env.DEV_DB_NAME,
//     host: '127.0.0.1',
//     dialect: 'postgres',
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl:
//         process.env.DB_SSL === 'true'
//           ? { require: true, rejectUnauthorized: false }
//           : false,
//     },
//     logging: false,
//   },
// };
