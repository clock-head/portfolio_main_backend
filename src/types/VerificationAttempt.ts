export interface VerificationAttemptCreationAttributes {
  ip: string;
  attempts: number;
  lockedUntil: Date | null;
}
