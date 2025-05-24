import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: [User], // add class models here
  // traditional .define() models loaded separately if needed
});
