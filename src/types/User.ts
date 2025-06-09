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
