import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

/** POST /api/orgs/:orgId/bugs */
export const reportBug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { errorMessage, stackTrace, userContext, screenshotUrl, stepsToReproduce } = req.body;

    if (!errorMessage || !stackTrace || !userContext) {
      return res.status(400).json({ error: 'errorMessage, stackTrace, userContext are required.' });
    }

    const bug = await prisma.bugReport.create({
      data: { orgId, errorMessage, stackTrace, userContext, screenshotUrl, stepsToReproduce },
    });
    // TODO: integrate with Jira/GitHub/Outlook
    res.status(201).json(bug);
  } catch (err) {
    next(err);
  }
};

/** GET /api/orgs/:orgId/bugs */
export const listBugs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const bugs = await prisma.bugReport.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bugs);
  } catch (err) {
    next(err);
  }
};
