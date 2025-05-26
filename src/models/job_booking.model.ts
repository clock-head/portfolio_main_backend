import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'job_bookings',
  timestamps: true,
  underscored: true,
})
export class JobBooking extends Model<JobBooking> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  job_booking_id!: number;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  start_date!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  end_date!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  locked_in!: boolean;

  @Default('booked')
  @Column(DataType.ENUM('booked', 'in_progress', 'revision', 'completed'))
  status!: 'booked' | 'in_progress' | 'revision' | 'completed';

  @Default(false)
  @Column(DataType.BOOLEAN)
  revised!: boolean;

  @AllowNull(true)
  @Column(DataType.TEXT)
  notes!: string | null;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => require('./user.model').User)
  user!: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}
