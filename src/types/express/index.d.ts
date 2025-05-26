import { IUser } from '../User';
import { ISession } from '../Session';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      session?: ISession;
    }
  }
}
