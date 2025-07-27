import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  suggestArticles,
} from '../controllers/articleController';

const router = Router({ mergeParams: true });

router.get('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getArticles);
router.get('/:id', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getArticleById);
router.post('/', auth, roles(['ADMIN', 'MANAGER']), createArticle);
router.put('/:id', auth, roles(['ADMIN', 'MANAGER']), updateArticle);
router.delete('/:id', auth, roles(['ADMIN', 'MANAGER']), deleteArticle);

// ✅ NEW: POST suggest articles
router.post('/suggest', auth, roles(['AGENT', 'MANAGER']), suggestArticles);

export default router;
