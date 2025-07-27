import express from 'express';
import { requireRole } from '../middleware/requireRole';
import { generate, getById } from '../controllers/callSummaryController';
import validateMemberInput from '../middleware/validateMemberInput';

// tells Express to match and nested routers inheirt params
const router = express.Router({ mergeParams: true });

// Agents need to read and write
router.post('/', requireRole(['MANAGER', 'ADMIN', 'AGENT']), validateMemberInput, generate);
router.get('/:id', requireRole(['MANAGER', 'ADMIN', 'AGENT']), getById);

export default router;
