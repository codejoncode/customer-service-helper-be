import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import validateCsvFile from '../middleware/validateCsvFile';
import validateCsvHeaders from '../middleware/validateCsvHeaders';
import validateMemberInput from '../middleware/validateMemberInput';
import multer from 'multer';

import {
  getMemberById,
  addMember,
  bulkAddOrUpdateMembers,
  uploadMembersCsv,
} from '../controllers/memberController';

import { retryImportJob } from '../controllers/retryImportJobController';

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

// ➕ Create new member
router.post('/', auth, roles(['ADMIN', 'MANAGER']), validateMemberInput, addMember);

// 🔍 Get specific member
router.get('/:memberId', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), getMemberById);

// 📦 Bulk JSON add/update
router.post('/bulk', auth, roles(['ADMIN', 'MANAGER']), bulkAddOrUpdateMembers);

// 📤 CSV upload
router.post(
  '/upload',
  auth,
  roles(['ADMIN', 'MANAGER']),
  upload.single('file'),
  validateCsvFile,
  validateCsvHeaders,
  uploadMembersCsv,
);

// 🔁 Retry import-job
router.patch('/import-jobs/:jobId/retry', auth, roles(['ADMIN', 'MANAGER']), retryImportJob);

export default router;
