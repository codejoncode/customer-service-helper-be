import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { createEscalation, listEscalations } from '../controllers/escalationController';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), listEscalations);
router.post('/', auth, roles(['AGENT', 'MANAGER', 'AGENT']), createEscalation);

export default router;
