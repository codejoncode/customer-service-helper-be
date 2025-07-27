import express from 'express';
import { requireRole } from '../middleware/requireRole';
import { list, search, tags, byId, create } from '../controllers/faqController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', list);
router.get('/search', search);
router.get('/tags', tags);
router.get('/:id', byId);
router.post('/', auth, requireRole(['ADMIN', 'MANAGER']), create);

// b) (Optional) Add a small Joi/Zod schema for FAQ if tests later validate payload shape.
export default router;
