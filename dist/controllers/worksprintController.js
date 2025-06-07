"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { getWorksprintsForDate, createNewWorksprint, } = require('../repositories/worksprints.repositories');
const date_fns_1 = require("date-fns");
module.exports = {
    getWorksprintsByDate: async (req, res) => {
        try {
            const dateString = req.query.date
                ? req.query.date
                : '';
            if (!(0, date_fns_1.isValid)(new Date(dateString))) {
                throw new Error('invalid date format');
            }
            const workSprints = await getWorksprintsForDate(dateString);
            return res.status(201).json({ workSprints: workSprints });
        }
        catch (error) {
            console.error('[Work Sprint Call Error]', error);
            return res
                .status(500)
                .json({ message: 'Internal server error.', error: error });
        }
    },
    createNewWorksprint: async (req, res) => {
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
            const parsedStartDate = (0, date_fns_1.parse)(sprintStartTime, 'HH:mm', new Date());
            const parsedEndDate = (0, date_fns_1.parse)(sprintEndTime, 'HH:mm', new Date());
            if (!(0, date_fns_1.isValid)(new Date(sprintDate)) ||
                !(0, date_fns_1.isValid)(parsedStartDate) ||
                !(0, date_fns_1.isValid)(parsedEndDate)) {
                throw new Error('Invalid date/time format');
            }
            const workSprint = await createNewWorksprint(payload);
            return res.status(201).json({
                message: 'Successfully created work sprint',
                workSprint: workSprint,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
};
