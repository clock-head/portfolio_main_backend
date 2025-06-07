"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const worksprintController = require('../controllers/worksprintController');
const { requireOperatorAuth } = require('../middleware/auth');
router.get('/operator=worksprints', requireOperatorAuth, worksprintController.getWorksprintsByDate);
router.post('/create', requireOperatorAuth, worksprintController.createNewWorksprint);
