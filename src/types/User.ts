import { Request, Response } from 'express';
import { User } from '@models/user.model';
import { Session } from '../models/session.model';

export interface SignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserPayload {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface UserCreationAttributes {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpiresAt?: Date | null;
}

export interface IUser {
  user_id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  lockedUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

//workaround for invalid global types that the TypeScript server cannot read.

export interface CustomRequest extends Request {
  user?: User;
  dbSession?: Session;
}

export interface CustomResponse extends Response {
  user?: User;
}
