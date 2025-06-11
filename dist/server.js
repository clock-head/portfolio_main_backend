"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const models_1 = require("./models");
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("reflect-metadata");
dotenv.config();
const app = express();
app.set('trust proxy', 1);
const sessionStore = new SequelizeStore({
    db: models_1.sequelize,
    table: 'Session',
});
// Routes
const authRoutes = require('./routes/authRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const worksprintRoutes = require('./routes/worksprintRoutes');
(async () => {
    try {
        await models_1.sequelize.authenticate();
        await models_1.sequelize.sync();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(cors({
            origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
            credentials: true,
        }));
        app.use(session({
            secret: process.env.SESSION_SECRET,
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
        }));
        app.use('/api/auth', authRoutes);
        app.use('/api/consultation', consultationRoutes);
        app.use('/api/worksprint', worksprintRoutes);
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('DB Bootstrap Failed:', err);
    }
})();
