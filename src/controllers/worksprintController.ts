import { Request, Response } from 'express';
const {
  getWorksprintsForDate,
  createNewWorksprint,
} = require('../repositories/worksprints.repositories');
import { isValid } from 'date-fns';

module.exports = {
  getWorksprintsByDate: async (req: Request, res: Response) => {
    try {
      const dateString = req.query.date;
      console.log(dateString);

      if (!isValid(dateString)) {
        throw new Error('invalid date format');
      }

      const workSprints = await getWorksprintsForDate(dateString);

      return res.status(201).json({ workSprints: workSprints });
    } catch (error) {
      console.error('[Work Sprint Call Error]', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  createNewWorksprint: async (req: Request, res: Response) => {
    try {
      const { sprintDate, sprintStartTime, sprintEndTime } = req.body;
      const payload = {
        sprintDate: sprintDate,
        sprintStartTime,
        sprintEndTime,
      };
      const workSprint = await createNewWorksprint(payload);
      return res.status(201).json({
        message: 'Successfully created work sprint',
        workSprint: workSprint,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },
};
