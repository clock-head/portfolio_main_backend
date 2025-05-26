import { Sequelize } from 'sequelize-typescript';
import { User } from './user.model';
import { Session } from './session.model';
import { Consultation } from './consultation.model';
import { JobBooking } from './job_booking.model';
import { WorkSprint } from './worksprint.model';

require('dotenv').config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  dialectOptions: {
    ssl:
      process.env.DB_SSL === 'true'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
  models: [User, Session, Consultation, JobBooking, WorkSprint], // Add all models here
});
