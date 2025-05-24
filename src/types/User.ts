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

export interface IUser {
  user_id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
