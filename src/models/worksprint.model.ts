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
export class WorkSprint extends Model<WorkSprint> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  work_sprint_id!: number;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  sprint_date!: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  sprint_start_time!: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  sprint_end_time!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}
