"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSprint = exports.JobBooking = exports.Consultation = exports.Session = exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const session_model_1 = require("./session.model");
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return session_model_1.Session; } });
const consultation_model_1 = require("./consultation.model");
Object.defineProperty(exports, "Consultation", { enumerable: true, get: function () { return consultation_model_1.Consultation; } });
const job_booking_model_1 = require("./job_booking.model");
Object.defineProperty(exports, "JobBooking", { enumerable: true, get: function () { return job_booking_model_1.JobBooking; } });
const worksprint_model_1 = require("./worksprint.model");
Object.defineProperty(exports, "WorkSprint", { enumerable: true, get: function () { return worksprint_model_1.WorkSprint; } });
require('dotenv').config();
const sequelize = new sequelize_typescript_1.Sequelize({
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
exports.sequelize = sequelize;
