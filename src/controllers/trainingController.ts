import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

/** POST /api/orgs/:orgId/training */
export const runTrainingSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { prompts, responses } = req.body;
    const agentId = req.user?.userId;

    if (!agentId || !prompts || !responses) {
      return res.status(400).json({ error: 'agentId, prompts, and responses are required.' });
    }

    const log = await prisma.trainingLog.create({
      data: { orgId, agentId, prompts, responses, training: true },
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

/** GET /api/orgs/:orgId/training */
export const listTrainingLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const logs = await prisma.trainingLog.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
