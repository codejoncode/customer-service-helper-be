import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { createCall, generateCallNotes } from '../controllers/callController';
import validateMemberInput from '../middleware/validateMemberInput';

const router = Router({ mergeParams: true });

// create a call log
router.post('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), validateMemberInput, createCall);

// generate notes on an existing call
router.post(
  '/generate-notes',
  auth,
  roles(['ADMIN', 'MANAGER', 'AGENT']),
  validateMemberInput,
  generateCallNotes,
);

export default router;
