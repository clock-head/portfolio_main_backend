"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Op } = require('sequelize');
// const { WorkSprint } = require('../models');
const { WorkSprintPayload, WorkSprintCreationAttributes, } = require('../types/WorkSprint');
async function getWorkSprintsForDate(date) {
    return require('../models/worksprint.model').WorkSprint.findAll({
        where: { sprintDate: date },
    });
}
async function createNewWorksprint(worksprintData) {
    return require('../models/worksprint.model').WorkSprint.create(worksprintData);
}
module.exports = {
    getWorkSprintsForDate,
    createNewWorksprint,
};
