import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import {
  getChecklists,
  getChecklistById,
  createChecklist,
  updateChecklist,
  deleteChecklist,
} from '../controllers/checklistController';
import validateMemberInput from '../middleware/validateMemberInput';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getChecklists);
router.get('/:id', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getChecklistById);
router.post('/', auth, roles(['ADMIN', 'MANAGER']), validateMemberInput, createChecklist);
router.put('/:id', auth, roles(['ADMIN', 'MANAGER']), validateMemberInput, updateChecklist);
router.delete('/:id', auth, roles(['ADMIN', 'MANAGER']), deleteChecklist);

export default router;
