const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
import { sequelize } from './models';
const cookieParser = require('cookie-parser');
const cors = require('cors');
import 'reflect-metadata';

dotenv.config();

const app = express();
app.set('trust proxy', 'loopback');

const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'Session',
});

// Routes
const authRoutes = require('./routes/authRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const worksprintRoutes = require('./routes/worksprintRoutes');

(async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
      cors({
        origin:
          process.env.FRONTEND_DOMAIN ||
          process.env.FRONTEND_ORIGIN ||
          process.env.FRONTEND_SUBDOMAIN ||
          'http://localhost:5173',
        credentials: true,
      })
    );

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
      })
    );

    app.use('/api/auth', authRoutes);
    app.use('/api/consultation', consultationRoutes);
    app.use('/api/worksprint', worksprintRoutes);

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('DB Bootstrap Failed:', err);
  }
})();
