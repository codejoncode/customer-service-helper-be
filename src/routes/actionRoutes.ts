import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import {
  getActions,
  getActionById,
  createOrUpdateMapping,
  updateMapping,
  deleteMapping,
} from '../controllers/actionController';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getActions);
router.get('/:id', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getActionById);
router.post('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), createOrUpdateMapping);
router.put('/:id', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), updateMapping);
router.delete('/:id', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), deleteMapping);

export default router;
