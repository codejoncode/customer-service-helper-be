import { Router } from 'express';
import { retryImportJob } from '../controllers/retryImportJobController';
import auth from '../middleware/auth';

const router = Router();

/**
 * PATCH /api/orgs/:orgId/import-jobs/:jobId/retry
 * Retries failed rows in a previously attempted import job.
 */
router.patch('/:jobId/retry', auth, retryImportJob);

export default router;
