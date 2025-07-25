// src/routes/faqRoutes.ts
import express from 'express';
import { requireRole } from '../middleware/requireRole';
import { list, search, tags, byId, create } from '../controllers/faqController';
import validateMemberInput from '../middleware/validateMemberInput';

const router = express.Router();

router.get('/', list);
router.get('/search', search);
router.get('/tags', tags);
router.get('/:id', byId);
router.post('/', requireRole(['ADMIN', 'MANAGER']), validateMemberInput, create);

export default router;
