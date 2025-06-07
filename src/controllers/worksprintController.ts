import { Request, Response } from 'express';
const {
  getWorksprintsForDate,
  createNewWorksprint,
} = require('../repositories/worksprints.repositories');
import { parse, isValid } from 'date-fns';

module.exports = {
  getWorksprintsByDate: async (req: Request, res: Response) => {
    try {
      const dateString: string = req.query.date
        ? (req.query.date as string)
        : '';

      if (!isValid(new Date(dateString))) {
        throw new Error('invalid date format');
      }

      const workSprints = await getWorksprintsForDate(dateString);

      return res.status(201).json({ workSprints: workSprints });
    } catch (error) {
      console.error('[Work Sprint Call Error]', error);
      return res
        .status(500)
        .json({ message: 'Internal server error.', error: error });
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

      if (!sprintDate || !sprintStartTime || !sprintEndTime) {
        return res.status(400).json({
          message: 'Please provide all required fields',
        });
      }

      const parsedStartDate = parse(sprintStartTime, 'HH:mm', new Date());
      const parsedEndDate = parse(sprintEndTime, 'HH:mm', new Date());

      if (
        !isValid(new Date(sprintDate)) ||
        !isValid(parsedStartDate) ||
        !isValid(parsedEndDate)
      ) {
        throw new Error('Invalid date/time format');
      }

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
