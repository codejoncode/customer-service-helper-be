import { Router } from 'express';
import auth from '../middleware/auth';
import roles from '../middleware/roles';
import { runTrainingSession, listTrainingLogs } from '../controllers/trainingController';

const router = Router({ mergeParams: true });

// agents, managers and admins can list training logs
router.get('/', auth, roles(['ADMIN', 'MANAGER', 'AGENT']), listTrainingLogs);

// agents and managers can start a training session
router.post('/', auth, roles(['AGENT', 'MANAGER']), runTrainingSession);

export default router;
