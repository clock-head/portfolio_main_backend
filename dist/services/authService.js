"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const crypto = require('crypto');
const getUserSession = async (rawToken) => {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    return await models_1.Session.findOne({ where: { tokenHash } });
};
const getUser = async (userId) => {
    return await models_1.User.findByPk(userId, {
        attributes: ['user_id', 'email', 'createdAt', 'firstName', 'lastName'],
    });
};
module.exports = {
    getUserSession,
    getUser,
};
