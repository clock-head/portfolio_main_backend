export interface ISession {
  token: string;
  userId: number;
  expiresAt: Date;
}

export interface SessionCreationAttributes {
  user_id: number;
  tokenHash: string;
  expiresAt: Date;
}
