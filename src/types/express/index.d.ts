import { Session } from '../models/session.model';
import { User } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      dbSession?: Session;
    }
  }
}
