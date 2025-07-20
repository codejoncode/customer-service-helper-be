import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { getValidationRules } from '../controllers/validationController';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER']), getValidationRules);

export default router;
