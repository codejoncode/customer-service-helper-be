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

router.get('/', auth, roles(['ADMIN', 'MANAGER']), getActions);
router.get('/:id', auth, roles(['ADMIN', 'MANAGER']), getActionById);
router.post('/', auth, roles(['ADMIN', 'MANAGER']), createOrUpdateMapping);
router.put('/:id', auth, roles(['ADMIN', 'MANAGER']), updateMapping);
router.delete('/:id', auth, roles(['ADMIN', 'MANAGER']), deleteMapping);

export default router;
