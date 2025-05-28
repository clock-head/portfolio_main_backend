import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';

import { ConsultationCreationAttributes } from '../types/Consultation';

@Table({
  tableName: 'consultations',
  underscored: true,
  timestamps: true,
})
export class Consultation extends Model<
  Consultation,
  ConsultationCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  consultation_id!: number;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY, field: 'selected_date' })
  selectedDate!: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: 'start_time' })
  startTime!: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: 'end_time' })
  endTime!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(
      'pending',
      'confirmed',
      'cancelled',
      'resolved',
      'open'
    ),
    field: 'resolution_status',
  })
  resolutionStatus!:
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'resolved'
    | 'open';

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'has_rescheduled' })
  hasRescheduled!: boolean;

  @AllowNull(true)
  @Column(DataType.TIME)
  notes!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @BelongsTo(() => require('./user.model').User)
  user!: import('./user.model').User;
}
