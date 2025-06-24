import { Model, Column, Table, DataType } from 'sequelize-typescript';
import { VerificationAttemptCreationAttributes } from '../types/VerificationAttempt';

@Table({ tableName: 'verification_attempts, underscored: true' })
export class VerificationAttempt extends Model<
  VerificationAttempt,
  VerificationAttemptCreationAttributes
> {
  @Column({ type: DataType.STRING, allowNull: false })
  ip!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  attempts!: number;

  @Column({ type: DataType.DATE, defaultValue: null, allowNull: true })
  lockedUntil!: Date | null;
}
