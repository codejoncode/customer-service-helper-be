import { RequestHandler } from 'express';
import { Role } from '../constants/roles';

const allowIfTrainingOrAgent: RequestHandler = (req, res, next) => {
  // grab the user object your auth middleware attached
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user as {
    userId: string;
    orgId: string;
    role: Role;
  };

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { role } = user;
  const trainingMode = req.get('X-Training-Mode') === 'true';

  // Agents always allowed
  if (role === 'AGENT') {
    return next();
  }

  // Managers/Admins only if trainingMode flag is on
  if ((role === 'MANAGER' || role === 'ADMIN') && trainingMode) {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden' });
};

export default allowIfTrainingOrAgent;
