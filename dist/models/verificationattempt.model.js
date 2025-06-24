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
exports.VerificationAttempt = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let VerificationAttempt = class VerificationAttempt extends sequelize_typescript_1.Model {
};
exports.VerificationAttempt = VerificationAttempt;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], VerificationAttempt.prototype, "ip", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 }),
    __metadata("design:type", Number)
], VerificationAttempt.prototype, "attempts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, defaultValue: null, allowNull: true }),
    __metadata("design:type", Object)
], VerificationAttempt.prototype, "lockedUntil", void 0);
exports.VerificationAttempt = VerificationAttempt = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'verification_attempts, underscored: true' })
], VerificationAttempt);
