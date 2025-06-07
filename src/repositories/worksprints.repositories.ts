import {
  WorkSprintCreationAttributes,
  WorkSprintPayload,
} from '../types/WorkSprint';
import { CreationAttributes } from 'sequelize';
const { Op } = require('sequelize');

// const { WorkSprint } = require('../models');
const {
  WorkSprintPayload,
  WorkSprintCreationAttributes,
} = require('../types/WorkSprint');

async function getWorksprintsForDate(date: string) {
  console.log('Fetching worksprints for date:', date);

  return require('../models/worksprint.model').WorkSprint.findAll({
    where: { sprintDate: date },
  });
}

async function createNewWorksprint(
  worksprintData: CreationAttributes<
    import('../models/worksprint.model').WorkSprint
  >
) {
  return require('../models/worksprint.model').WorkSprint.create(
    worksprintData
  );
}

module.exports = {
  getWorksprintsForDate,
  createNewWorksprint,
};
