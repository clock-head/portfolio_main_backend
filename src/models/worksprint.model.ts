import { WorkSprintCreationAttributes } from '../types/WorkSprint';

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'work_sprints',
  timestamps: true,
  underscored: true,
})
export class WorkSprint extends Model<
  WorkSprint,
  WorkSprintCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  work_sprint_id!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATEONLY, field: 'sprint_date' })
  sprintDate!: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: 'sprint_start_time' })
  sprintStartTime!: string;

  @AllowNull(false)
  @Column({ type: DataType.TIME, field: 'sprint_end_time' })
  sprintEndTime!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}
