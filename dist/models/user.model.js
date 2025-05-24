"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const session_model_1 = require("./session.model");
const consultation_model_1 = require("./consultation.model");
const job_booking_model_1 = require("./job_booking.model");
let User = class User extends sequelize_typescript_1.Model {
};
exports.User = User;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], User.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'first_name' }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'last_name' }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, field: 'is_admin' }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'is_admin' }),
    __metadata("design:type", Date)
], User.prototype, "lockedUntil", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => session_model_1.Session, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => consultation_model_1.Consultation, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", consultation_model_1.Consultation)
], User.prototype, "consultation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => job_booking_model_1.JobBooking, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], User.prototype, "jobBookings", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'users' })
], User);
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
