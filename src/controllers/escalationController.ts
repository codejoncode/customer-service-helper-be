import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

/** POST /api/orgs/:orgId/escalations */
export const createEscalation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { callLogId, memberId, reason, auditLog } = req.body;

    if (!callLogId || !memberId) {
      return res.status(400).json({ error: 'callLogId and memberId are required.' });
    }

    const escalation = await prisma.escalation.create({
      data: { orgId, callLogId, memberId, reason, auditLog },
    });
    // TODO: enqueue Teams/email send job here
    res.status(201).json(escalation);
  } catch (err) {
    next(err);
  }
};

/** GET /api/orgs/:orgId/escalations */
export const listEscalations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const items = await prisma.escalation.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};
