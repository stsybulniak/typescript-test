import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import i18next from 'i18next';
import i18nMidelware from 'i18next-express-middleware';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/errorMiddleware';
import { i18nextInit } from './services/i18nextService';
import {
  initGoogleStrategy,
  initJwtStrategy,
  initLocalStrategy,
  initRefreshTokenStrategy
} from './services/passportService';
import passport from 'passport';
import session from 'express-session';
import socketio from 'socket.io';
import http from 'http';

import indexRoutes from './routes/index';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import localesRoutes from './routes/locales';

import { isDev, isProd, isTest } from './utils';
import HttpException from './exceptions/HttpException';
import { NOT_FOUND } from 'http-status-codes';

const result = dotenv.config({ path: isTest ? './.env.test' : './.env' });
if (result.error) {
  console.log('Environment variables not initialized');
  process.exit(-1);
}

class App {
  private app: express.Application;
  private server: any;
  private port: number;
  public static i18n: any;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    const io = socketio(this.server);
    this.app.set('io', io);
  }

  public getApp() {
    return this.app;
  }

  private async connectToDatabase() {
    const { MONGO_URL } = process.env;
    mongoose.Promise = global.Promise;
    try {
      await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true });
      if (isDev) mongoose.set('debug', true);
    } catch (err) {
      console.log('DB not initialized');
      // process.exit(-1);
    }
  }

  private initializeRoutes() {
    this.app.use('/api', indexRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api', localesRoutes);
  }

  private initializeMiddlewares() {
    i18nextInit();

    if (isProd) {
      this.app.use(helmet());
      this.app.disable('x-powered-by');
      this.app.use(morgan('combined'));
    } else {
      this.app.use(morgan('dev'));
    }
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(i18nMidelware.handle(i18next));
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      App.i18n = req.i18n;
      next();
    });
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(passport.initialize());
    passport.serializeUser((user, cb) => cb(null, user));
    passport.deserializeUser((obj, cb) => cb(null, obj));

    initLocalStrategy();
    initJwtStrategy();
    initRefreshTokenStrategy();
    initGoogleStrategy();

    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
      })
    );
  }

  private initializeErrorHandling() {
    // handle not found
    this.app.use((req, res, next) => {
      const err = new HttpException(NOT_FOUND, App.i18n.t('errors:clientErrors.notFound'));
      next(err);
    });

    this.app.use(errorMiddleware);
  }

  public listen() {
    this.server.listen(this.port, err => {
      if (err) return console.log(err.message());

      return console.log(`server is listening on ${this.port}`);
    });
  }
}

export default App;
