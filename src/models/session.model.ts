import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { SessionCreationAttributes } from '../types/Session';

@Table({
  tableName: 'sessions',
  timestamps: true,
  underscored: true,
})
export class Session extends Model<Session, SessionCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  session_id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'token_hash' })
  tokenHash!: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'expires_at' })
  expiresAt!: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}
