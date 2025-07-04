"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const models_1 = require("./models");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const stripeWebhook_route_1 = __importDefault(require("./routes/stripeWebhook.route"));
dotenv.config();
exports.app = express();
exports.app.set('trust proxy', 'loopback');
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
        exports.app.use('/api/stripe/webhook', body_parser_1.default.raw({ type: 'application/json' }), stripeWebhook_route_1.default);
        exports.app.use(express.json());
        exports.app.use(express.urlencoded({ extended: true }));
        exports.app.use(cookieParser());
        exports.app.use(cors({
            origin: process.env.FRONTEND_DOMAIN ||
                process.env.FRONTEND_ORIGIN ||
                process.env.FRONTEND_SUBDOMAIN ||
                'http://localhost:5173',
            credentials: true,
        }));
        exports.app.use(session({
            secret: process.env.SESSION_SECRET,
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
        }));
        exports.app.use('/api/auth', authRoutes);
        exports.app.use('/api/consultation', consultationRoutes);
        exports.app.use('/api/worksprint', worksprintRoutes);
        const PORT = process.env.PORT || 4000;
        exports.app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('DB Bootstrap Failed:', err);
    }
})();
