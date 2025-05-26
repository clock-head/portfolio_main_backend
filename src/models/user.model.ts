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
import { Session } from './session.model';
import { Consultation } from './consultation.model';
import { JobBooking } from './job_booking.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
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
  lockedUntil!: Date;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt!: Date;

  // Associations

  @HasMany(() => Session, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  sessions!: Session[];

  @HasOne(() => Consultation, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
  })
  consultation!: Consultation;

  @HasMany(() => JobBooking, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  jobBookings!: JobBooking[];
}

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     'User',
//     {
//       user_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       first_name: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       last_name: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//           isEmail: true,
//         },
//       },
//       password_hash: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       is_admin: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//       locked_until: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },
//     },
//     {
//       tableName: 'users',
//       underscored: true,
//       timestamps: true,
//     }
//   );

//   User.associate = (models) => {
//     User.hasMany(models.Session, {
//       foreignKey: 'user_id',
//       onDelete: 'CASCADE',
//     });

//     User.hasOne(models.Consultation, {
//       foreignKey: 'user_id',
//       onDelete: 'SET NULL',
//     });

//     User.hasMany(models.Job_Booking, {
//       foreignKey: 'user_id',
//       onDelete: 'CASCADE',
//     });
//   };

//   return User;
// };
