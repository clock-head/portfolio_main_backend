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

import { User } from './user.model';
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

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

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
  @Default('pending')
  @Column(DataType.STRING)
  status!: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: 'resolution_status' })
  resolutionStatus!: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: 'has_rescheduled' })
  hasRescheduled!: boolean;

  @AllowNull(false)
  @Column(DataType.TIME)
  notes!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}
