import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { reportBug, listBugs } from '../controllers/bugController';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER']), listBugs);
router.post('/', auth, roles(['AGENT', 'MANAGER', 'AGENT']), reportBug);

export default router;
