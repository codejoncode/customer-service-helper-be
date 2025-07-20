import express from 'express';
import { requireRole } from '../middleware/requireRole';
import { generate, getById } from '../controllers/callSummaryController';
import validateMemberInput from '../middleware/validateMemberInput';

// tells Express to match and nested routers inheirt params
const router = express.Router({ mergeParams: true });

router.post('/', requireRole(['MANAGER', 'ADMIN']), validateMemberInput, generate);
router.get('/:id', requireRole(['MANAGER', 'ADMIN']), getById);

export default router;
