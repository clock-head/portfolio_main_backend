import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { UserCreationAttributes } from '../types/User';

@Table({ tableName: 'users', underscored: true })
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  user_id!: number;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column({ type: DataType.STRING, field: 'password_hash' })
  passwordHash!: string;

  @Column({ type: DataType.STRING, field: 'first_name' })
  firstName!: string;

  @Column({ type: DataType.STRING, field: 'last_name' })
  lastName!: string;

  @Column({ type: DataType.BOOLEAN, field: 'is_admin' })
  isAdmin!: boolean;

  @Column({ type: DataType.DATE, field: 'locked_until' })
  lockedUntil!: Date | null;

  @Column({ type: DataType.BOOLEAN, field: 'email_verified' })
  emailVerified!: boolean;

  @Column({
    type: DataType.STRING,
    field: 'email_verification_token',
    allowNull: true,
  })
  emailVerificationToken!: string | null;

  @Column({
    type: DataType.DATE,
    field: 'email_verification_expires_at',
    allowNull: true,
  })
  emailVerificationExpiresAt!: Date | null;

  @Column({
    type: DataType.INTEGER,
    field: 'verification_attempts',
  })
  verificationAttempts!: number;

  @Column({
    type: DataType.BOOLEAN,
    field: 'compromised',
    defaultValue: false,
  })
  compromised!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: 'in_violation',
    defaultValue: false,
  })
  inViolation!: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;

  // Associations

  @HasMany(() => require('./session.model').Session, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  sessions!: import('./session.model').Session[];

  @HasOne(() => require('./consultation.model').Consultation, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
  })
  consultation!: import('./consultation.model').Consultation;

  @HasMany(() => require('./job_booking.model').JobBooking, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  jobBookings!: import('./job_booking.model').JobBooking[];
}
