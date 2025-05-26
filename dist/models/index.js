"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const session_model_1 = require("./session.model");
const consultation_model_1 = require("./consultation.model");
const job_booking_model_1 = require("./job_booking.model");
const worksprint_model_1 = require("./worksprint.model");
require('dotenv').config();
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true'
            ? {
                require: true,
                rejectUnauthorized: false,
            }
            : false,
    },
    models: [user_model_1.User, session_model_1.Session, consultation_model_1.Consultation, job_booking_model_1.JobBooking, worksprint_model_1.WorkSprint], // Add all models here
});
