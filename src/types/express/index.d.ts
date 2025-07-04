import { Session } from '../models/session.model';
import { User } from '../models/user.model';
//import { User } from '../User';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      dbSession?: Session;
    }
  }
}

export {};
