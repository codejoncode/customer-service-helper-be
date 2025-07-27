import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import allowIfTrainingOrAgent from '../middleware/allowIfTrainingOrAgent';
import validateMemberInput from '../middleware/validateMemberInput';

import { validateMember } from '../controllers/memberValidationController';

const router = Router({ mergeParams: true });

// POST /api/orgs/:orgId/members/:memberId/validate
router.post(
  '/:memberId/validate',
  auth,
  roles(['AGENT', 'MANAGER']),
  allowIfTrainingOrAgent,
  validateMemberInput,
  validateMember,
);

export default router;
