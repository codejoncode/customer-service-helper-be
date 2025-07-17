import { Router } from 'express'
import auth from '../middleware/auth'
import roles from '../middleware/roles'
import {
  getChecklists,
  getChecklistById,
  createChecklist,
  updateChecklist,
  deleteChecklist,
} from '../controllers/checklistController'

const router = Router({ mergeParams: true })

router.get('/', auth, roles(['ADMIN', 'MANAGER']), getChecklists)
router.get('/:id', auth, roles(['ADMIN', 'MANAGER']), getChecklistById)
router.post('/', auth, roles(['ADMIN', 'MANAGER']), createChecklist)
router.put('/:id', auth, roles(['ADMIN', 'MANAGER']), updateChecklist)
router.delete('/:id', auth, roles(['ADMIN', 'MANAGER']), deleteChecklist)

export default router;