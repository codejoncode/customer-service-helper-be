import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { getMembers, addMember } from '../controllers/memberController';
import validateMemberInput from '../middleware/validateMemberInput';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER']), getMembers);
router.post('/', auth, roles(['ADMIN', 'MANAGER']), validateMemberInput, addMember);

export default router;
