import express from 'express';
const router = express.Router();
const worksprintController = require('../controllers/worksprintController');
const { requireOperatorAuth } = require('../middleware/auth');

router.get(
  '/operator-worksprints',
  requireOperatorAuth,
  worksprintController.getWorksprintsByDate
);

router.post(
  '/create',
  requireOperatorAuth,
  worksprintController.createNewWorksprint
);

module.exports = router;
