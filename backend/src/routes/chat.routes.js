import express from 'express';
import { getMessages } from '../controllers/chat.controller.js';

const router = express.Router();

// Fetch previous messages
router.get('/:projectId', getMessages);

export default router;
