import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { createCall, generateCallNotes } from '../controllers/callController';
import validateMemberInput from '../middleware/validateMemberInput';

const router = Router({ mergeParams: true });

router.post('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), validateMemberInput, createCall);
router.post(
  '/generate-notes',
  auth,
  roles(['ADMIN', 'MANAGER', 'AGENT']),
  validateMemberInput,
  generateCallNotes,
);

export default router;
